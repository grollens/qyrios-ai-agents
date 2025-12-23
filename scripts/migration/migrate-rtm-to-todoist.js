/**
 * RTM to Todoist Migration Script
 * 
 * Migrates all tasks from Remember The Milk to Todoist
 * 
 * Usage:
 *   1. Configure Todoist MCP in Cursor (see migration guide)
 *   2. Run: node scripts/migration/migrate-rtm-to-todoist.js
 * 
 * The script will:
 * - Extract all projects (tag: -) and create Todoist projects
 * - Extract all tasks and create Todoist tasks
 * - Map RTM tags to Todoist labels
 * - Map RTM priorities to Todoist priorities
 * - Preserve due dates
 */

const { getTasks, getLists } = require('../rtm/rtm-api');
const fs = require('fs');
const path = require('path');

// Priority mapping: RTM → Todoist
// RTM: 1 (high), 2 (medium), 3 (low), N (none)
// Todoist: 4 (p1), 3 (p2), 2 (p3), 1 (p4/normal)
const PRIORITY_MAP = {
  '1': 4, // RTM high → Todoist p1
  '2': 3, // RTM medium → Todoist p2
  '3': 2, // RTM low → Todoist p3
  'N': 1  // RTM none → Todoist p4 (normal)
};

// Tag mapping: RTM tags → Todoist labels
const TAG_MAP = {
  'jobb': 'Jobb',
  'fritid': 'Fritid',
  'utveckling': 'Utveckling',
  'hemma': 'Hemma',
  'stan': 'Stan',
  'kontor': 'Kontor',
  'bil': 'Bil',
  'samtal': 'Samtal',
  'waiting_for': 'Waiting For',
  'someday': 'Someday',
  'maybe': 'Maybe',
  'info': 'Info'
};

async function extractRTMData() {
  console.log('📥 Extracting data from RTM...\n');
  
  const lists = await getLists();
  const tasks = await getTasks();
  
  const projects = [];
  const allTasks = [];
  const allTags = new Set();
  
  const taskLists = tasks.list || [];
  
  taskLists.forEach(list => {
    if (!list.taskseries) return;
    
    const taskseries = Array.isArray(list.taskseries) ? list.taskseries : [list.taskseries];
    
    taskseries.forEach(series => {
      const task = Array.isArray(series.task) ? series.task[0] : series.task;
      
      // Skip completed tasks
      if (task.completed && task.completed !== '') return;
      
      const tags = [];
      if (series.tags && series.tags.tag) {
        const tagList = Array.isArray(series.tags.tag) ? series.tags.tag : [series.tags.tag];
        tags.push(...tagList);
        tagList.forEach(t => allTags.add(t));
      }
      
      const taskData = {
        name: series.name,
        priority: task.priority || 'N',
        tags: tags,
        due: task.due || null,
        list_id: list.id,
        taskseries_id: series.id,
        task_id: task.id,
        notes: series.notes?.note || []
      };
      
      // Check if it's a project
      if (tags.includes('-')) {
        projects.push(taskData);
      } else {
        allTasks.push(taskData);
      }
    });
  });
  
  console.log(`✅ Extracted:`);
  console.log(`   - ${projects.length} projects`);
  console.log(`   - ${allTasks.length} tasks`);
  console.log(`   - ${allTags.size} unique tags\n`);
  
  return { projects, allTasks, allTags: Array.from(allTags) };
}

function formatDateForTodoist(rtmDate) {
  if (!rtmDate) return null;
  
  // RTM format: "2025-12-05T23:00:00Z"
  // Todoist format: "YYYY-MM-DD" or natural language
  const date = new Date(rtmDate);
  return date.toISOString().split('T')[0]; // "2025-12-05"
}

function mapPriority(rtmPriority) {
  return PRIORITY_MAP[rtmPriority] || 1;
}

function mapTags(rtmTags) {
  // Filter out project tag (-) and map others
  return rtmTags
    .filter(tag => tag !== '-')
    .map(tag => TAG_MAP[tag] || tag); // Use mapped name or original if not mapped
}

async function generateMigrationPlan(rtmData) {
  console.log('📋 Generating migration plan...\n');
  
  const { projects, allTasks, allTags } = rtmData;
  
  const migrationPlan = {
    projects: projects.map(project => ({
      rtm_id: project.taskseries_id,
      name: project.name,
      priority: mapPriority(project.priority),
      labels: mapTags(project.tags),
      due: formatDateForTodoist(project.due)
    })),
    tasks: allTasks.map(task => ({
      rtm_id: task.taskseries_id,
      name: task.name,
      priority: mapPriority(task.priority),
      labels: mapTags(task.tags),
      due: formatDateForTodoist(task.due),
      notes: task.notes.length > 0 ? task.notes.map(n => n.$t || n).join('\n') : null
    })),
    labels: Array.from(allTags)
      .filter(tag => tag !== '-')
      .map(tag => ({
        rtm_tag: tag,
        todoist_label: TAG_MAP[tag] || tag
      }))
  };
  
  // Save migration plan to file
  const planPath = path.join(__dirname, 'migration-plan.json');
  fs.writeFileSync(planPath, JSON.stringify(migrationPlan, null, 2));
  
  console.log(`✅ Migration plan saved to: ${planPath}\n`);
  console.log('📊 Summary:');
  console.log(`   - ${migrationPlan.projects.length} projects to create`);
  console.log(`   - ${migrationPlan.tasks.length} tasks to create`);
  console.log(`   - ${migrationPlan.labels.length} labels to create\n`);
  
  return migrationPlan;
}

async function main() {
  console.log('🚀 RTM to Todoist Migration\n');
  console.log('═══════════════════════════════════════════════════════════════\n');
  
  try {
    // Step 1: Extract RTM data
    const rtmData = await extractRTMData();
    
    // Step 2: Generate migration plan
    const migrationPlan = await generateMigrationPlan(rtmData);
    
    console.log('═══════════════════════════════════════════════════════════════\n');
    console.log('✅ Migration plan generated!\n');
    console.log('📝 Next steps:');
    console.log('   1. Configure Todoist MCP in Cursor (see migration guide)');
    console.log('   2. Review migration-plan.json');
    console.log('   3. Run migration script (when Todoist MCP is ready)');
    console.log('\n💡 The migration plan is saved and ready for execution.');
    
  } catch (error) {
    console.error('❌ Error:', error.message);
    process.exit(1);
  }
}

if (require.main === module) {
  main();
}

module.exports = { extractRTMData, generateMigrationPlan, mapPriority, mapTags, formatDateForTodoist };


