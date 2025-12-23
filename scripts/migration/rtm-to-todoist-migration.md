# RTM to Todoist Migration Plan

## Overview

This document outlines the migration strategy from Remember The Milk (RTM) to Todoist.

## Mapping Strategy

### Projects
- **RTM**: Tasks with tag `-` are projects
- **Todoist**: Create as Projects
- **Action**: Extract all tasks with tag `-`, create Todoist projects

### Tasks
- **RTM**: All other tasks
- **Todoist**: Create as Tasks under appropriate projects
- **Action**: Map tasks to projects based on shared tags/context

### Labels/Tags
- **RTM Tags** → **Todoist Labels**:
  - `jobb` → Label: "Jobb"
  - `fritid` → Label: "Fritid"
  - `utveckling` → Label: "Utveckling"
  - `hemma` → Label: "Hemma"
  - `stan` → Label: "Stan"
  - `kontor` → Label: "Kontor"
  - `bil` → Label: "Bil"
  - `samtal` → Label: "Samtal"
  - `waiting_for` → Label: "Waiting For"
  - `someday` → Label: "Someday"
  - `maybe` → Label: "Maybe"
  - All other tags → Create as labels

### Priorities
- **RTM Priority** → **Todoist Priority**:
  - `1` (High) → `4` (p1 - highest)
  - `2` (Medium) → `3` (p2)
  - `3` (Low) → `2` (p3)
  - `N` (None) → `1` (p4 - normal)

### Due Dates
- **RTM**: ISO date format
- **Todoist**: ISO date format (same)
- **Action**: Direct mapping

### Subtasks
- **RTM**: Subtasks are linked in UI but not in API
- **Todoist**: Native subtask support via API
- **Action**: Manual mapping or identify through naming conventions

## Migration Steps

1. **Setup Todoist MCP (Recommended)**
   
   Todoist has official MCP support. Follow the [Todoist MCP Setup Guide](https://developer.todoist.com/api/v1/#tag/Todoist-MCP) for detailed instructions.
   
   **Quick Setup:**
   
   Add Todoist MCP to your Cursor configuration (check the official docs for the exact package name and setup):
   
   ```json
   {
     "mcpServers": {
       "todoist": {
         "type": "stdio",
         "command": "npx",
         "args": ["-y", "@todoist/mcp-server"],
         "env": {
           "TODOIST_API_TOKEN": "YOUR_TODOIST_API_TOKEN_HERE"
         }
       }
     }
   }
   ```
   
   **To get your Todoist API token:**
   1. Go to [Todoist Settings](https://todoist.com/app/settings/integrations)
   2. Navigate to **Integrations** → **Developer**
   3. Copy your API token
   
   **Important**: Check the [official Todoist MCP documentation](https://developer.todoist.com/api/v1/#tag/Todoist-MCP) for the exact setup instructions, as the package name and configuration may vary.
   
   After adding, restart Cursor to load the Todoist MCP.

2. **Alternative: Setup Todoist API (if MCP not available)**
   - Get API token from Todoist Settings
   - Store in `.env` or config file

2. **Extract RTM Data**
   - Get all projects (tag: `-`)
   - Get all tasks
   - Get all tags/labels

3. **Create Todoist Structure**
   - Create projects for each RTM project
   - Create labels for each RTM tag
   - Map tasks to projects

4. **Migrate Tasks**
   - Create tasks in Todoist
   - Assign labels
   - Set priorities
   - Set due dates
   - Link subtasks (if identifiable)

5. **Verification**
   - Compare counts
   - Spot check random tasks
   - Verify projects and labels

## Files

- `migrate-rtm-to-todoist.js` - Main migration script
- `todoist-api.js` - Todoist API wrapper
- `migration-mapping.json` - Mapping configuration

