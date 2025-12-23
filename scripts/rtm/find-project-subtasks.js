/**
 * Find subtasks for each project
 * Note: RTM API doesn't explicitly return subtasks, so we need to identify them
 * through other means (shared tags, name matching, etc.)
 * 
 * For now, we'll show projects and ask user to identify subtasks manually
 * until we can find a better way to identify them via API
 */

const { getTasks } = require('./rtm-api');

async function findProjectSubtasks() {
  console.log('📊 Finding projects and their potential subtasks...\n');
  console.log('NOTE: RTM API may not return subtasks explicitly.');
  console.log('We\'ll identify potential subtasks through shared tags and name matching.\n');
  
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
    
    // Sort projects by priority
    const priorityOrder = { '1': 1, '2': 2, '3': 3, 'N': 4 };
    projects.sort((a, b) => {
      const aPrio = priorityOrder[a.priority] || 4;
      const bPrio = priorityOrder[b.priority] || 4;
      if (aPrio !== bPrio) return aPrio - bPrio;
      return a.name.localeCompare(b.name);
    });
    
    console.log(`Found ${projects.length} projects\n`);
    console.log('═══════════════════════════════════════════════════════════════\n');
    
    // For each project, try to find potential subtasks
    projects.forEach((project, index) => {
      const prioEmoji = { '1': '🔴', '2': '🟠', '3': '🔵', 'N': '⚪' }[project.priority];
      
      console.log(`${index + 1}. ${prioEmoji} ${project.name}`);
      console.log(`   Tags: ${project.tags.join(', ')}`);
      if (project.due) {
        console.log(`   Due: ${project.due.split('T')[0]}`);
      }
      console.log(`   ID: ${project.taskseries_id}`);
      console.log(`   ⚠️  Subtasks need to be identified manually or via RTM UI`);
      console.log(`   💡 Check RTM UI for subtasks under this project`);
      console.log('');
    });
    
    console.log('═══════════════════════════════════════════════════════════════');
    console.log('RECOMMENDATION:');
    console.log('Since RTM API may not return subtasks, we should:');
    console.log('1. Check RTM UI for each project to see actual subtasks');
    console.log('2. Or use RTM API method to get task details (if available)');
    console.log('3. Or identify subtasks through naming conventions/tags');
    
  } catch (error) {
    console.error('Error:', error.message);
  }
}

findProjectSubtasks().catch(console.error);


