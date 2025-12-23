/**
 * List all projects and show their associated actions more accurately
 */

const { getTasks } = require('./rtm-api');

async function listAllProjectsWithActions() {
  console.log('📊 Listing all projects with their actions...\n');
  
  try {
    const tasks = await getTasks();
    const taskLists = tasks.list || [];
    
    const projects = [];
    const allTasks = [];
    
    taskLists.forEach(list => {
      if (!list.taskseries) return;
      
      const taskseries = Array.isArray(list.taskseries) ? list.taskseries : [list.taskseries];
      
      taskseries.forEach(series => {
        const task = Array.isArray(series.task) ? series.task[0] : series.task;
        
        if (task.completed && task.completed !== '') return;
        
        const tags = [];
        if (series.tags && series.tags.tag) {
          const tagList = Array.isArray(series.tags.tag) ? series.tags.tag : [series.tags.tag];
          tags.push(...tagList);
        }
        
        const taskData = {
          name: series.name,
          priority: task.priority || 'N',
          tags: tags,
          due: task.due || null,
          list_id: list.id,
          taskseries_id: series.id,
          task_id: task.id
        };
        
        if (tags.includes('-')) {
          projects.push(taskData);
        } else {
          allTasks.push(taskData);
        }
      });
    });
    
    console.log(`Found ${projects.length} projects\n`);
    console.log('═══════════════════════════════════════════════════════════════\n');
    
    // Sort projects by priority (1, 2, 3, N)
    const priorityOrder = { '1': 1, '2': 2, '3': 3, 'N': 4 };
    projects.sort((a, b) => {
      const aPrio = priorityOrder[a.priority] || 4;
      const bPrio = priorityOrder[b.priority] || 4;
      if (aPrio !== bPrio) return aPrio - bPrio;
      return a.name.localeCompare(b.name);
    });
    
    // For each project, find related tasks
    projects.forEach((project, index) => {
      const prioEmoji = { '1': '🔴', '2': '🟠', '3': '🔵', 'N': '⚪' }[project.priority];
      const projectTags = project.tags.filter(t => t !== '-');
      const projectNameWords = project.name.toLowerCase()
        .split(/[\s,()]+/)
        .filter(w => w.length > 3); // Words longer than 3 chars
      
      // Find tasks that might be related
      const relatedTasks = allTasks.filter(task => {
        // Check for shared specific tags (not just life area)
        const sharedTags = projectTags.filter(tag => 
          task.tags.includes(tag) && 
          !['jobb', 'fritid', 'utveckling'].includes(tag) // Exclude life area tags
        );
        
        // Check if task name contains project keywords
        const nameMatch = projectNameWords.some(word => 
          task.name.toLowerCase().includes(word)
        );
        
        // Check for specific project indicators (TD, Tradedoubler, etc.)
        const projectIndicators = ['td', 'tradedoubler', 'ica', 'byggvesta', 'blodtrycksdoktorn', 
          'ridestore', 'simon', 'corin', 'victoria', 'neela', 'matthias', 'samuel', 
          'digjourney', 'champion', 'sg', 'steering'];
        const hasProjectIndicator = projectIndicators.some(indicator => 
          project.name.toLowerCase().includes(indicator) && 
          task.name.toLowerCase().includes(indicator)
        );
        
        return sharedTags.length > 0 || nameMatch || hasProjectIndicator;
      });
      
      console.log(`${index + 1}. ${prioEmoji} ${project.name}`);
      console.log(`   Tags: ${project.tags.join(', ')}`);
      if (project.due) {
        console.log(`   Due: ${project.due.split('T')[0]}`);
      }
      
      if (relatedTasks.length > 0) {
        console.log(`   ✅ ${relatedTasks.length} related action(s):`);
        relatedTasks.forEach(task => {
          const taskPrio = { '1': '🔴', '2': '🟠', '3': '🔵', 'N': '⚪' }[task.priority];
          const taskTags = task.tags.length > 0 ? ` [${task.tags.join(', ')}]` : '';
          console.log(`      ${taskPrio} ${task.name}${taskTags}`);
        });
      } else {
        console.log(`   ⚠️  No related actions found`);
      }
      console.log('');
    });
    
    const projectsWithActions = projects.filter(project => {
      const projectTags = project.tags.filter(t => t !== '-');
      const projectNameWords = project.name.toLowerCase()
        .split(/[\s,()]+/)
        .filter(w => w.length > 3);
      
      return allTasks.some(task => {
        const sharedTags = projectTags.filter(tag => 
          task.tags.includes(tag) && 
          !['jobb', 'fritid', 'utveckling'].includes(tag)
        );
        const nameMatch = projectNameWords.some(word => 
          task.name.toLowerCase().includes(word)
        );
        const projectIndicators = ['td', 'tradedoubler', 'ica', 'byggvesta', 'blodtrycksdoktorn', 
          'ridestore', 'simon', 'corin', 'victoria', 'neela', 'matthias', 'samuel', 
          'digjourney', 'champion', 'sg', 'steering'];
        const hasProjectIndicator = projectIndicators.some(indicator => 
          project.name.toLowerCase().includes(indicator) && 
          task.name.toLowerCase().includes(indicator)
        );
        return sharedTags.length > 0 || nameMatch || hasProjectIndicator;
      });
    });
    
    console.log('═══════════════════════════════════════════════════════════════');
    console.log(`Total projects: ${projects.length}`);
    console.log(`Projects with actions: ${projectsWithActions.length}`);
    console.log(`Projects without actions: ${projects.length - projectsWithActions.length}`);
    
  } catch (error) {
    console.error('Error:', error.message);
  }
}

listAllProjectsWithActions().catch(console.error);


