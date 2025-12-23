/**
 * Show each project and try to identify which actions are actually connected
 * Based on shared tags (beyond life areas) and name matching
 */

const { getTasks } = require('./rtm-api');

async function showProjectActions() {
  console.log('📊 Analyzing projects and their connected actions...\n');
  
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
    
    console.log(`Found ${projects.length} projects and ${allTasks.length} actions\n`);
    console.log('═══════════════════════════════════════════════════════════════\n');
    
    // For each project, find actions that share specific tags (not just life areas)
    projects.forEach((project, index) => {
      const prioEmoji = { '1': '🔴', '2': '🟠', '3': '🔵', 'N': '⚪' }[project.priority];
      
      // Get project tags excluding life areas and project tag
      const projectSpecificTags = project.tags.filter(t => 
        t !== '-' && 
        !['jobb', 'fritid', 'utveckling'].includes(t)
      );
      
      // Find actions that share specific tags with project
      const relatedByTags = allTasks.filter(task => {
        // Check if task shares any specific tag with project
        return projectSpecificTags.some(tag => task.tags.includes(tag));
      });
      
      // Also try name-based matching for common project keywords
      const projectName = project.name.toLowerCase();
      const relatedByName = allTasks.filter(task => {
        const taskName = task.name.toLowerCase();
        
        // Check for specific project mentions
        if (projectName.includes('tradedoubler') || projectName.includes('td')) {
          return taskName.includes('td') || taskName.includes('tradedoubler');
        }
        if (projectName.includes('champion')) {
          return taskName.includes('champion');
        }
        if (projectName.includes('sg') || projectName.includes('steering')) {
          return taskName.includes('sg') || taskName.includes('steering');
        }
        if (projectName.includes('ica')) {
          return taskName.includes('ica') || taskName.includes('samuel');
        }
        if (projectName.includes('blodtrycksdoktorn')) {
          return taskName.includes('blodtrycksdoktorn') || 
                 (taskName.includes('laura') && taskName.includes('jonas'));
        }
        if (projectName.includes('byggvesta')) {
          return taskName.includes('byggvesta');
        }
        if (projectName.includes('simon')) {
          return taskName.includes('simon');
        }
        if (projectName.includes('coaching')) {
          return taskName.includes('coaching') || taskName.includes('corin');
        }
        if (projectName.includes('ai-transformation')) {
          return taskName.includes('ai-transformation') || taskName.includes('ai transformation');
        }
        if (projectName.includes('dans')) {
          return taskName.includes('dans') || taskName.includes('gaga') || taskName.includes('5r');
        }
        if (projectName.includes('terapi')) {
          return taskName.includes('terapi') || taskName.includes('gestalt') || taskName.includes('angelika');
        }
        if (projectName.includes('mansgrupp')) {
          return taskName.includes('mansgrupp');
        }
        if (projectName.includes('circling')) {
          return taskName.includes('circling') || taskName.includes('einar') || taskName.includes('daniel ek');
        }
        
        return false;
      });
      
      // Combine both methods, remove duplicates
      const relatedTasks = [...new Set([...relatedByTags, ...relatedByName])];
      
      console.log(`${index + 1}. ${prioEmoji} ${project.name}`);
      console.log(`   Tags: ${project.tags.join(', ')}`);
      if (project.due) {
        console.log(`   Due: ${project.due.split('T')[0]}`);
      }
      
      if (relatedTasks.length > 0) {
        console.log(`   ✅ ${relatedTasks.length} action(s) found:`);
        relatedTasks.forEach(task => {
          const taskPrio = { '1': '🔴', '2': '🟠', '3': '🔵', 'N': '⚪' }[task.priority];
          const taskTags = task.tags.length > 0 ? ` [${task.tags.join(', ')}]` : '';
          console.log(`      ${taskPrio} ${task.name}${taskTags}`);
        });
      } else {
        console.log(`   ⚠️  No actions found (may need manual review)`);
      }
      console.log('');
    });
    
    console.log('═══════════════════════════════════════════════════════════════');
    console.log('NOTE: This analysis is based on shared tags and name matching.');
    console.log('You may need to manually verify which actions belong to each project.');
    
  } catch (error) {
    console.error('Error:', error.message);
  }
}

showProjectActions().catch(console.error);


