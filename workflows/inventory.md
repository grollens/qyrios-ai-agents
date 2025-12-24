# Workflow Inventory

Master list of all N8N workflows in the Qyrios system.

## Content Engine Workflows

> **Namnkonvention**: `CE-X.Y` där X = fas och Y = workflow inom fasen.
> Faser: 1=Input, 2=Enrichment, 3=Production, 4=Analysis, 5=Learning, 9=Utility

### CE-1.0: News Editor
- **Status**: Production
- **n8n ID**: `xhrCoul7OWH796Kb`
- **Agent**: News Analyser
- **Dependencies**: Artisan Base (Sources, Content tables)

### CE-1.1: Quick Draft
- **Status**: Production
- **n8n ID**: `QhTdveZN836tTp3W`
- **Dependencies**: Slack, Artisan Base (Content table)

### CE-2.0: Interview Trigger
- **Status**: Production
- **n8n ID**: `0uivucNHZe4cXtxT`
- **Agent**: Insight Gatherer
- **Dependencies**: Artisan Base (Content table), Slack, GitHub Pages

### CE-2.1: Interview Chat
- **Status**: Production
- **n8n ID**: `MH2X99khIhTvTa1R`
- **Agent**: Insight Gatherer (Claude Sonnet)
- **Dependencies**: Artisan Base (Content, Brand Guide tables)

### CE-3.0: Content Production
- **Status**: Production
- **n8n ID**: `QT0qhhlrHwdW0Qc6`
- **Agent**: Content Writer, Image Generator
- **Dependencies**: Artisan Base (Content table)

### CE-4.0: Performance Retriever
- **Status**: Production
- **n8n ID**: `QjdBaF25Bxnz1ulQ`
- **Dependencies**: Apify, Artisan Base (Content table)

### CE-4.1: Performance Analyser
- **Status**: Production
- **n8n ID**: `L69usft0w47kmOem`
- **Agent**: Strategy Analyst
- **Dependencies**: Artisan Base (Content, Content Feedback tables), Perplexity

### CE-5.0: Content Coach
- **Status**: Production
- **n8n ID**: `B7VQMNvOXmeaf6Gx`
- **Agent**: Writing Coach
- **Dependencies**: Artisan Base (Content Feedback, Suggested Improvements tables)

### CE-9.0: LinkedIn Backfill
- **Status**: Production (Utility - normally inactive)
- **n8n ID**: `MSATKEg7V1JqySb0`
- **Dependencies**: Apify, Artisan Base (Content table)

---

## Relationship Cultivator Workflows

### Automated Prospect Research (WF-4.1)
- **Status**: Production
- **Location**: `systems/relationship-cultivator/workflows/`
- **Design**: [Design Document](../systems/relationship-cultivator/design/relationship-cultivator-design.md#52-workflow-automated-prospect-research--analysis-wf-41)
- **Dependencies**: Relationship Database (Contacts, ContactResearch tables)

### AI-Powered Meeting Briefing (WF-4.2)
- **Status**: Production
- **Location**: `systems/relationship-cultivator/workflows/`
- **Design**: [Design Document](../systems/relationship-cultivator/design/relationship-cultivator-design.md#53-workflow-ai-powered-meeting-briefing-wf-42)
- **Dependencies**: Relationship Database (Contacts, LoggedInteractions tables)

### Manual Post-Interaction Logging (WF-4.3)
- **Status**: Production
- **Location**: `systems/relationship-cultivator/workflows/`
- **Dependencies**: Relationship Database (Contacts, LoggedInteractions tables)

### Unified Proactive Engagement (WF-5.5)
- **Status**: Production
- **Location**: `systems/relationship-cultivator/workflows/`
- **Design**: [Design Document](../systems/relationship-cultivator/design/relationship-cultivator-design.md#55-workflow-unified-proactive-engagement-consolidated)
- **Dependencies**: Relationship Database (Contacts, MessageSuggestions tables)

### Opportunity Management (WF-4.5)
- **Status**: Production
- **Location**: `systems/relationship-cultivator/workflows/`
- **Dependencies**: Relationship Database (Opportunities table)

### 3-Bullet Briefing (WF-4.7)
- **Status**: Production
- **Location**: `systems/relationship-cultivator/workflows/`
- **Dependencies**: Relationship Database (Contacts, LoggedInteractions tables)

### Automatic Logging (WF-4.8)
- **Status**: Production
- **Location**: `systems/relationship-cultivator/workflows/`
- **Design**: [Design Document](../systems/relationship-cultivator/design/relationship-cultivator-design.md#59-workflow-automatic-logging-wf-48)
- **Dependencies**: Relationship Database (Contacts, LoggedInteractions tables), Microsoft Outlook

### Message Coach (WF-4.9)
- **Status**: Production
- **Location**: `systems/relationship-cultivator/workflows/`
- **Design**: [Design Document](../systems/relationship-cultivator/design/relationship-cultivator-design.md#510-workflow-message-coach-wf-49)
- **Dependencies**: Relationship Database (MessageSuggestions, Configuration tables)

### Warm Leads from LinkedIn (WF-4.10)
- **Status**: Production
- **Location**: `systems/relationship-cultivator/workflows/`
- **Design**: [Design Document](../systems/relationship-cultivator/design/relationship-cultivator-design.md#511-workflow-warm-leads-from-linkedin-wf-410)
- **Dependencies**: Relationship Database (ContentLeads, ContentEngagement tables), Apify

---

## Competitive Intelligence Workflows

### Daily Signal Gathering (WF-5.1)
- **Status**: Proposed
- **Location**: `systems/competitive-intelligence/workflows/signal-gathering/`
- **Design**: [Design Document](../systems/competitive-intelligence/design/competitive-intelligence-design.md#wf-51-daily-signal-gathering)
- **Dependencies**: Intelligence Database (IntelligenceSources, RawSignals tables)
- **Trigger**: Daily 06:00

### Signal Filtering & Categorization (WF-5.2)
- **Status**: Proposed
- **Location**: `systems/competitive-intelligence/workflows/signal-filtering/`
- **Design**: [Design Document](../systems/competitive-intelligence/design/competitive-intelligence-design.md#wf-52-signal-filtering--categorization)
- **Dependencies**: Intelligence Database (RawSignals, CuratedInsights tables), Content Database (Brand Guide)
- **Trigger**: Daily 08:00

### Competitor Activity Monitor (WF-5.3)
- **Status**: Proposed
- **Location**: `systems/competitive-intelligence/workflows/competitor-monitor/`
- **Design**: [Design Document](../systems/competitive-intelligence/design/competitive-intelligence-design.md#wf-53-competitor-activity-monitor)
- **Dependencies**: Intelligence Database (Competitors, CuratedInsights tables)
- **Trigger**: Weekly Wednesday 06:00

### AI Tools Discovery (WF-5.4)
- **Status**: Proposed
- **Location**: `systems/competitive-intelligence/workflows/tools-discovery/`
- **Design**: [Design Document](../systems/competitive-intelligence/design/competitive-intelligence-design.md#wf-54-ai-tools-discovery)
- **Dependencies**: Intelligence Database (AITools, CuratedInsights tables)
- **Trigger**: Bi-weekly (1st and 15th)

### Weekly Intelligence Briefing (WF-5.5)
- **Status**: Proposed
- **Location**: `systems/competitive-intelligence/workflows/weekly-briefing/`
- **Design**: [Design Document](../systems/competitive-intelligence/design/competitive-intelligence-design.md#wf-55-weekly-intelligence-briefing)
- **Dependencies**: Intelligence Database (CuratedInsights, WeeklyBriefings tables)
- **Trigger**: Sunday 18:00

### Content Engine Integration (WF-5.6)
- **Status**: Proposed
- **Location**: `systems/competitive-intelligence/workflows/content-integration/`
- **Design**: [Design Document](../systems/competitive-intelligence/design/competitive-intelligence-design.md#wf-56-content-engine-integration)
- **Dependencies**: Intelligence Database (CuratedInsights), Content Database (Content)
- **Trigger**: On CuratedInsight creation with SuggestedAction: ContentIdea

---

## Shared Workflows

(To be added as shared workflows are identified)

---

## Workflow Status Legend

- **Production**: Live and actively used
- **Development**: In development, not yet deployed
- **Proposed**: Designed but not yet implemented
- **Deprecated**: No longer in use, kept for reference

---

## Workflow ID Ranges

| System | Prefix | ID Format | Notes |
|--------|--------|-----------|-------|
| Content Engine | CE | CE-X.Y | X=fas (1-5,9), Y=workflow |
| Relationship Cultivator | RC | WF-4.x, WF-5.5 | Legacy naming (att migrera) |
| Competitive Intelligence | CI | WF-5.x | Proposed workflows |

---

## Notes

This inventory should be updated:
- When new workflows are added
- When workflow status changes
- When workflows are deprecated
- When dependencies are discovered

**Last Updated**: 2025-12-24
