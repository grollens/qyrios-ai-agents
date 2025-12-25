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

> **Namnkonvention**: `RC-X.Y` där X = fas och Y = workflow inom fasen.
> Faser: 1=Lead Input, 2=Research, 3=Engagement, 4=Logging, 5=Learning, 9=Utility

### RC-1.0: Warm Leads
- **Status**: Production
- **n8n ID**: `s2agbztlFTqsF2dd`
- **Agent**: Lead Identifier
- **Dependencies**: Apify, Relationship Database (ContentLeads, ContentEngagement tables)

### RC-2.0: Contact Research
- **Status**: Production
- **n8n ID**: `IGL91FZ3hm95CzkG`
- **Agent**: Research Analyst
- **Dependencies**: Relationship Database (Contacts, ContactResearch tables)

### RC-2.1: Meeting Briefing
- **Status**: Production
- **n8n ID**: `N5xR3TUqobZmSDqS`
- **Agent**: Meeting Preparer
- **Dependencies**: Relationship Database (Contacts, LoggedInteractions tables)

### RC-3.0: Comment Suggester
- **Status**: Production
- **n8n ID**: `wEaqb1Z7E47oR4Wt`
- **Agent**: Engagement Strategist
- **Dependencies**: Relationship Database (Contacts, MessageSuggestions tables)

### RC-3.1: Quick Briefing
- **Status**: Production
- **n8n ID**: `PrhnuR5BURIrz8si`
- **Dependencies**: Relationship Database (Contacts, LoggedInteractions tables)

### RC-4.0: Interaction Logger
- **Status**: Production
- **n8n ID**: `OgtZQeQ4JC2yqkVz`
- **Agent**: Interaction Summarizer
- **Dependencies**: Relationship Database (Contacts, LoggedInteractions tables), Microsoft Outlook

### RC-5.0: Message Coach
- **Status**: Production
- **n8n ID**: `jrzXYijrXp43yyyh`
- **Agent**: Message Coach
- **Dependencies**: Relationship Database (MessageSuggestions, Configuration tables)

### RC-9.0: Message Writer
- **Status**: Production (Utility - inactive)
- **n8n ID**: `x2h6E15ZPmjDTADC`
- **Agent**: Pipeline Analyst
- **Dependencies**: Relationship Database (Opportunities table)

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
| Relationship Cultivator | RC | RC-X.Y | X=fas (1-5,9), Y=workflow |
| Competitive Intelligence | CI | CI-X.Y | Att migrera |

---

## Notes

This inventory should be updated:
- When new workflows are added
- When workflow status changes
- When workflows are deprecated
- When dependencies are discovered

**Last Updated**: 2025-12-24
