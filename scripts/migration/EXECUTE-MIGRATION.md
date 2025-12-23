# Execute RTM to Todoist Migration

This guide will help you execute the migration once Todoist MCP is configured.

## Prerequisites

✅ Migration plan generated (`migration-plan.json`)  
✅ Todoist MCP configured in Cursor  
✅ Todoist API token available

## Migration Execution Steps

Once Todoist MCP is ready, I can help you execute the migration in this order:

### Step 1: Create Labels
Create all Todoist labels from the migration plan:
- Jobb, Fritid, Utveckling (life areas)
- Hemma, Stan, Kontor, Bil (contexts)
- Samtal, Waiting For, Someday, Maybe (status tags)
- Any other custom labels

### Step 2: Create Projects
Create all 23 projects in Todoist:
- Each RTM project (tag: `-`) becomes a Todoist project
- Preserve project names
- Set project colors/order if needed

### Step 3: Create Tasks
For each of the 117 tasks:
- Create task in appropriate project (or Inbox)
- Assign labels
- Set priority (mapped from RTM)
- Set due date (if exists)
- Add notes/description (if exists)

### Step 4: Link Subtasks
- Identify subtask relationships (if possible)
- Create parent-child relationships in Todoist

### Step 5: Verification
- Count projects: Should be 23
- Count tasks: Should be 117
- Count labels: Should be 14
- Spot check random tasks to verify data integrity

## Ready to Execute?

Once Todoist MCP is configured, say:
- "Let's execute the migration"
- "Start migrating to Todoist"
- "Create the projects and tasks in Todoist"

I'll guide you through each step and use the Todoist MCP tools to create everything.

## Reference

- [Todoist MCP Documentation](https://developer.todoist.com/api/v1/#tag/Todoist-MCP)
- Migration plan: `scripts/migration/migration-plan.json`


