# RTM to Todoist Migration

This directory contains scripts and documentation for migrating tasks from Remember The Milk (RTM) to Todoist.

## Quick Start

1. **Generate Migration Plan** (Already done):
   ```bash
   node scripts/migration/migrate-rtm-to-todoist.js
   ```
   This creates `migration-plan.json` with all your RTM tasks and projects.

2. **Configure Todoist MCP**:
   - Add Todoist MCP to Cursor (see `rtm-to-todoist-migration.md`)
   - Get your Todoist API token from [Todoist Settings](https://todoist.com/app/settings/integrations)

3. **Review Migration Plan**:
   - Check `migration-plan.json` to verify the mapping
   - Adjust priorities, labels, or project assignments if needed

4. **Execute Migration** (When Todoist MCP is ready):
   - Once Todoist MCP is configured in Cursor, I can help you execute the migration
   - The migration will create all projects, labels, and tasks in Todoist

## Files

- `migrate-rtm-to-todoist.js` - Main migration script (generates plan)
- `migration-plan.json` - Generated migration plan (review before executing)
- `rtm-to-todoist-migration.md` - Detailed migration guide
- `todoist-api.js` - Todoist API wrapper (for manual migration if needed)

## Migration Summary

From your RTM data:
- **23 projects** to migrate
- **117 tasks** to migrate  
- **14 labels** to create

## Next Steps

Once Todoist MCP is configured, I can help you:
1. Create all labels in Todoist
2. Create all projects in Todoist
3. Create all tasks with proper labels, priorities, and due dates
4. Verify the migration was successful


