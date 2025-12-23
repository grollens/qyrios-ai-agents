/**
 * Strict analysis - only show actions that are actually related to projects
 */

const { getTasks } = require('./rtm-api');

async function analyzeProjectsStrict() {
  console.log('📊 Analyzing projects with strict matching...\n');
  
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
    
    // For each project, find ONLY actions that are clearly related
    projects.forEach((project, index) => {
      const prioEmoji = { '1': '🔴', '2': '🟠', '3': '🔵', 'N': '⚪' }[project.priority];
      
      // Extract key words from project name (excluding numbers, common words)
      const projectName = project.name.toLowerCase();
      const projectWords = projectName
        .replace(/[0-9/()]/g, ' ') // Remove numbers and parentheses
        .split(/\s+/)
        .filter(w => w.length > 4 && !['gjorda', 'skapade', 'hållna', 'utförda', 'avklarad'].includes(w));
      
      // Find tasks that are clearly related
      const relatedTasks = allTasks.filter(task => {
        const taskName = task.name.toLowerCase();
        
        // Check if task name contains project-specific keywords
        const hasProjectKeyword = projectWords.some(word => 
          taskName.includes(word)
        );
        
        // Check for specific project mentions (TD, Tradedoubler, ICA, etc.)
        const specificMatches = {
          'tradedoubler': ['td', 'tradedoubler'],
          'ica': ['ica', 'samuel'],
          'byggvesta': ['byggvesta'],
          'blodtrycksdoktorn': ['blodtrycksdoktorn', 'laura', 'jonas'],
          'champion': ['champion', 'champions'],
          'sg': ['sg', 'steering'],
          'mansgrupper': ['mansgrupp'],
          'danser': ['dans', 'gaga', '5r'],
          'terapisessioner': ['terapi', 'gestalt'],
          'coachingar': ['coaching', 'simon'],
          'kundmöten': ['byggvesta', 'blodtrycksdoktorn', 'ica', 'ridestore', 'tradedoubler'],
          'circling': ['circling', 'einar', 'daniel ek'],
          'ai-transformation': ['ai-transformation', 'ai transformation'],
          'coachingprogrammen': ['coachingprogram'],
          'pcc certifiering': ['pcc', 'certifiering'],
          'föreläsningar': ['föreläsning', 'centigo', 'blodtrycksdoktorn'],
          'metallverk': ['metallverk'],
          'boende': ['boende', 'lägenhet'],
          'kursen hjärnan': ['hjärnan', 'medvetenhet']
        };
        
        // Check for specific project matches
        for (const [projectKey, keywords] of Object.entries(specificMatches)) {
          if (projectName.includes(projectKey)) {
            return keywords.some(keyword => taskName.includes(keyword));
          }
        }
        
        return hasProjectKeyword;
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
    
  } catch (error) {
    console.error('Error:', error.message);
  }
}

analyzeProjectsStrict().catch(console.error);


