/**
 * Analyze which projects have actions (tasks) associated with them
 */

const { getTasks, getTaskContext } = require('./rtm-api');

async function analyzeProjectActions() {
  console.log('📊 Analyzing projects and their associated actions...\n');
  
  try {
    // Get all tasks
    const tasks = await getTasks();
    const taskLists = tasks.list || [];
    
    // Find all projects (tag: -)
    const projects = [];
    const allTasks = [];
    
    taskLists.forEach(list => {
      if (!list.taskseries) return;
      
      const taskseries = Array.isArray(list.taskseries) ? list.taskseries : [list.taskseries];
      
      taskseries.forEach(series => {
        const task = Array.isArray(series.task) ? series.task[0] : series.task;
        
        // Skip completed tasks
        if (task.completed && task.completed !== '') return;
        
        // Get tags
        const tags = [];
        if (series.tags && series.tags.tag) {
          const tagList = Array.isArray(series.tags.tag) ? series.tags.tag : [series.tags.tag];
          tags.push(...tagList);
        }
        
        const taskData = {
          name: series.name,
          priority: task.priority || 'N',
          tags: tags,
          list_id: list.id,
          taskseries_id: series.id,
          task_id: task.id
        };
        
        // Check if it's a project
        if (tags.includes('-')) {
          projects.push(taskData);
        } else {
          allTasks.push(taskData);
        }
      });
    });
    
    console.log(`Found ${projects.length} projects and ${allTasks.length} non-project tasks\n`);
    console.log('═══════════════════════════════════════════════════════════════');
    console.log('PROJECT ANALYSIS:');
    console.log('═══════════════════════════════════════════════════════════════\n');
    
    // For each project, try to find related tasks
    projects.forEach(project => {
      const projectName = project.name.toLowerCase();
      const projectTags = project.tags.filter(t => t !== '-'); // Remove project tag
      
      // Find tasks that might be related to this project
      const relatedTasks = allTasks.filter(task => {
        // Check if task shares tags with project (excluding -)
        const sharedTags = projectTags.filter(tag => task.tags.includes(tag));
        
        // Check if task name contains project keywords
        const nameMatch = projectName.split(' ').some(word => 
          word.length > 3 && task.name.toLowerCase().includes(word)
        );
        
        return sharedTags.length > 0 || nameMatch;
      });
      
      const prioEmoji = { '1': '🔴', '2': '🟠', '3': '🔵', 'N': '⚪' }[project.priority];
      
      console.log(`${prioEmoji} ${project.name}`);
      console.log(`   Tags: ${project.tags.join(', ')}`);
      
      if (relatedTasks.length > 0) {
        console.log(`   ✅ Has ${relatedTasks.length} related action(s):`);
        relatedTasks.slice(0, 3).forEach(task => {
          const taskPrio = { '1': '🔴', '2': '🟠', '3': '🔵', 'N': '⚪' }[task.priority];
          console.log(`      ${taskPrio} ${task.name}`);
        });
        if (relatedTasks.length > 3) {
          console.log(`      ... and ${relatedTasks.length - 3} more`);
        }
      } else {
        console.log(`   ⚠️  No related actions found`);
      }
      console.log('');
    });
    
    // Summary
    const projectsWithActions = projects.filter(project => {
      const projectName = project.name.toLowerCase();
      const projectTags = project.tags.filter(t => t !== '-');
      return allTasks.some(task => {
        const sharedTags = projectTags.filter(tag => task.tags.includes(tag));
        const nameMatch = projectName.split(' ').some(word => 
          word.length > 3 && task.name.toLowerCase().includes(word)
        );
        return sharedTags.length > 0 || nameMatch;
      });
    });
    
    console.log('═══════════════════════════════════════════════════════════════');
    console.log('SUMMARY:');
    console.log('═══════════════════════════════════════════════════════════════\n');
    console.log(`Total projects: ${projects.length}`);
    console.log(`Projects with actions: ${projectsWithActions.length}`);
    console.log(`Projects without actions: ${projects.length - projectsWithActions.length}`);
    
  } catch (error) {
    console.error('Error:', error.message);
  }
}

analyzeProjectActions().catch(console.error);


