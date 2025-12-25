# Relationship Cultivator - Design Document

**Version**: 4.2 | **Date**: 2025-12-24 | **Status**: Approved  
**Author**: Christian

> **Single Source of Truth**: This document is the central and authoritative source of truth for the Relationship Cultivator. It serves as a living contract that guides design, development, and validation of the system.

---

## Version History

| Version | Date | Author | Change Description |
|---------|------|--------|-------------------|
| 4.2 | 2025-12-24 | Christian | Renamed all workflows to RC-X.Y format for consistency. RC-1.0 Warm Leads, RC-2.0/2.1 Research, RC-3.0/3.1 Engagement, RC-4.0 Logging, RC-5.0 Learning, RC-9.0 Utility. |
| 4.1 | 2025-11-29 | Christian | Updated table names (MessageSuggestions, LoggedInteractions), added Message Coach (WF 4.9) and Warm Leads from LinkedIn (WF 4.10) workflows, updated WF 4.8 to Production, moved WF 4.0 to backlog as paused. |
| 4.0 | 2025-11-29 | Christian | Consolidated ThoughtLeaders into Contacts table. Updated OutreachDrafts with EffortLevel. Integrated "No Action" logic in WF 5.5. Corrected internal references. |
| 3.4 | 2025-10-19 | Christian | Added 📢 Influencer to ContactType. Corrected table formatting. |
| 3.x | - | Christian | Previous iterations (see archive). |

---

## Table of Contents

1. [Purpose & Scope](#0-purpose--scope)
2. [Vision & Strategic Goals](#1-vision--strategic-goals)
3. [Business Process](#2-overall-business-process)
4. [System Architecture](#3-system-architecture)
5. [Data Model & Schema](#4-data-model--schema)
6. [Core Workflows](#5-core-workflows-workflows)
7. [AI Agents](#ai-agents)
8. [Risks & Security](#risks--security)
9. [Backlog](#backlog)

---

## 0. Purpose & Scope

### In-Scope

- Automated lead generation and qualification
- Proactive generation of outreach suggestions (email, LinkedIn)
- Generation of meeting briefings
- Pipeline management
- Systematic learning of user's style
- Hybrid logging of interactions

### Out-of-Scope

- Automatic sending without human review
- Billing/Financial transactions
- Integration with social media other than LinkedIn

---

## 1. Vision & Strategic Goals

### 1.1 Vision

To systematically and authentically nurture a core network of 50-100 professional key relationships, ensuring a consistent and lifelong flow of business opportunities.

### 1.2 Problem Statement

Managing valuable relationships at scale is a challenge. Important interactions are forgotten and CRM systems are often too transactional. This leads to missed opportunities and weakened networks.

### 1.3 Core Philosophy & Solution Principles

| Principle | Description |
|-----------|-------------|
| **Systematic Authenticity** | The system strengthens relationships, it doesn't automate them. |
| **Human-in-the-Loop** | The human always has the final say. |
| **Segmented Engagement** | Interactions are adapted to the relationship's purpose (e.g., Influencer vs Customer). |
| **Low Threshold** | The system prioritizes "Low Effort" interactions to ensure continuity. |

### 1.4 Target Effects

- **Lowered Threshold to Act**: (KPI: Number of sent drafts/week)
- **Strengthened Strategic Confidence**: (KPI: FeedbackRating)
- **Increased Empathy**: (KPI: Response rate on outreach)

### 1.5 Business Goals

- **Increased Pipeline Value**: (KPI: Total Expected Value)

---

## 2. Overall Business Process

### 2.1 Process Description

**Prospecting**: Search query → Apollo list → AI qualification → Manual "Relevant" marking.

**Processing**: Deep research → AI-generated outreach suggestions (Low/Medium/High effort) → Manual editing & Sending.

**Nurturing**: Conversion to Contact → Ongoing "Nurturing" via automatic suggestions (comments, check-ins) → Meeting booking → Opportunity.

### 2.2 Process Visualization

```
Search → ColdLeads (New) → [AI Scan] → ColdLeads (Relevant) → 
[Research] → MessageSuggestions → [Manual] → Contacts → Opportunities

Content Engagement → ContentLeads → [Convert] → Contacts
```

---

## 3. System Architecture

### 3.1 Core Components

| Component | Technology |
|-----------|-----------|
| **Orchestration** | n8n |
| **Database** | Airtable |
| **AI** | OpenAI, Anthropic (Claude Sonnet 3.5/4 for outreach) |
| **Data** | Apollo.io, Apify, Perplexity AI |
| **UI** | Slack (Notifications), Microsoft Outlook |

### 3.3 Non-Functional Requirements

| Requirement | Target |
|-------------|--------|
| **Performance** | Outreach suggestions within 120s |
| **Cost** | Max €0.15 per lead qualification |
| **Reliability** | 98% success rate on flows |

---

## 4. Data Model & Schema

### 4.1 Core Tables

See [Database Schema](../databases/relationship-base/schema.md) for detailed field definitions.

#### Table: Contacts (Consolidated)

**Purpose**: Central registry for ALL people (Customers, Prospects, Influencers).

**Key Fields**:
- `FullName` (Formula) - FirstName + LastName
- `LinkedInURL` (URL) - Link to profile
- `Email` (Email) - Contact's email
- `ContactType` (Single Select) - Purpose: Segmentation
  - 🎯 Prospect
  - 💬 Dialogue
  - 🤝 Customer
  - 🌐 Network
  - 📢 Influencer
- `RelationshipHealth` (Rating) - Priority (1-5). Health rating of the relationship
- `LastContact` (Formula) - Date of last interaction (calculated from LastInteraction and LastOutreach)
- `ContactInterval` (Formula) - Days between desired contact (calculated based on ContactType)

#### Table: MessageSuggestions

**Purpose**: Handles AI-generated outreach suggestions before manual review and sending. (Note: Table name in Airtable is "MessageSuggestions", not "OutreachDrafts")

**Key Fields**:
- `Contact` (Link) - Link to Contacts table
- `OutreachType` (Single Select) - Communication channel type
  - post_comment
  - comment_reply
  - email
  - email_casual
  - no_action
- `EffortLevel` (Single Select) - To sort "easy wins" and prioritize low-threshold interactions
  - Low
  - Medium
  - High
- `Status` (Single Select) - 📥 Draft, ⛔️ Rejected, ➡️ Sent
- `Motivation` (Long text) - AI's analysis + Links to sources
- `Message` (Long text) - AI-generated draft message
- `ImprovedMessage` (Long text) - User's final edited text (after manual review)
- `Feedback` (Single Line Text) - User feedback on the suggestion

#### Table: ColdLeads

**Purpose**: Prospecting funnel.

**Key Fields**:
- `linkedin_url` (URL) - Primary key
- `Status` (Single Select) - New, Scanned, Relevant, Researched, Qualified, Outreached, Contact, Closed
- `QualificationScore` (Number) - AI rating (1-10)
- `AI_AnalysisSummary` (Long text) - Research summary
- `SuggestedService` (Single Select) - Matched service

**Additional Tables** (see schema for details):
- Companies
- Opportunities
- LoggedInteractions (Note: Table name in Airtable is "LoggedInteractions", not "Interactions")
- ContactResearch
- ContentLeads (Warm leads from content engagement)
- ContentEngagement (Individual engagement events)
- ColdLeadOutreachs (Outreach drafts for ColdLeads)
- Configuration

### 4.2 Table Relationships

Hub-and-spoke with Contacts in the center. ColdLeads convert to Contacts.

---

## 5. Core Workflows (Workflows)

### Namnkonvention

**Format**: `RC-X.Y` där:
- **RC** = Relationship Cultivator
- **X** = Fas (1=Lead Input, 2=Research, 3=Engagement, 4=Logging, 5=Learning, 9=Utility)
- **Y** = Workflow inom fasen

---

### RC-1.0: Warm Leads

**Purpose**: Identify and track warm leads from LinkedIn content engagement (likes, comments, shares).  
**n8n ID**: `s2agbztlFTqsF2dd`  
**Status**: ✅ Production

**Process**:
1. **Trigger**: Scheduled weekly (Sundays)
2. **Calculate Scores**: Get last 30 days engagements, calculate engagement scores
3. **Identify High Interest**: Find new high-interest leads based on engagement patterns
4. **Scrape**: Get recent LinkedIn posts and engagement data (Apify)
5. **Extract**: Extract individual engagement events
6. **Log**: Log engagements to ContentEngagement table
7. **Create/Update**: Create or update ContentLeads (WarmLeads) records
8. **Link**: Link engagements to warm leads
9. **Notify**: Send Slack notifications for high-interest leads

---

### RC-2.0: Contact Research

**Purpose**: Deep research on individual contact.  
**n8n ID**: `IGL91FZ3hm95CzkG`  
**Status**: ✅ Production

**Process**: Webhook → Scrape LinkedIn + Perplexity News → AI analysis → Save to ContactResearch.

---

### RC-2.1: Meeting Briefing

**Purpose**: Meeting preparation.  
**n8n ID**: `N5xR3TUqobZmSDqS`  
**Status**: ✅ Production

**Process**: Gather all data → AI synthesis (Value hypotheses, Empathy, Questions) → Slack report.

---

### RC-3.0: Comment Suggester

**Purpose**: The central flow for generating contact suggestions. Prioritizes low threshold.  
**n8n ID**: `wEaqb1Z7E47oR4Wt`  
**Trigger**: Scheduled (Daily)  
**Status**: ✅ Production

**Process**:

1. **Selection**: Fetch Contacts that are "Due" OR ContactType = Influencer
2. **Data**: Fetch fresh LinkedIn posts, comments, and company news
3. **AI Decision & Generation** (Hierarchy):
   - **Case A (Lowest Threshold)**: New LinkedIn post found? → Create Channel: LinkedIn Comment, Effort: Low
   - **Case B (Low Threshold)**: New comment found? → Create Channel: LinkedIn Comment (Reply), Effort: Low
   - **Case C (Medium Threshold)**: Big news? → Create Channel: Email/DM, Effort: Medium
   - **Case D (High Threshold)**: Just time passed? → Create Channel: Email (Check-in), Effort: High
   - **Case E (Silence Decision)**: Nothing relevant to say? → NO_ACTION (Create no draft)
4. **Output**: Save to MessageSuggestions
5. **Notification**: Slack message with link to Airtable and LinkedIn post

---

### RC-3.1: Quick Briefing

**Purpose**: Quick check before calls ("3-Bullet Briefing").  
**n8n ID**: `PrhnuR5BURIrz8si`  
**Status**: ✅ Production

**Process**: Fetch latest interaction + latest post → Send 3 points to Slack.

---

### RC-4.0: Interaction Logger

**Purpose**: Automatically capture emails and calendar meetings from Microsoft Outlook.  
**n8n ID**: `OgtZQeQ4JC2yqkVz`  
**Status**: ✅ Production

**Process**: 
1. **Trigger**: Scheduled daily at 02:00
2. **Fetch**: Get all contacts from Airtable
3. **Retrieve**: Get yesterday's calendar events and emails from Microsoft Outlook
4. **Match**: Match events/emails to contacts using email addresses
5. **Create**: Create interaction records in LoggedInteractions table
6. **AI Summary**: Use AI agent to generate summaries of interactions
7. **Update**: Update interactions with AI-generated summaries
8. **Notify**: Send Slack notifications for unmatched items

---

### RC-5.0: Message Coach

**Purpose**: Systematic learning from user feedback to improve messaging rules.  
**n8n ID**: `jrzXYijrXp43yyyh`  
**Status**: ✅ Production

**Process**:
1. **Trigger**: Scheduled (weekly)
2. **Fetch**: Get week's drafts from MessageSuggestions table
3. **Analyze**: AI agent extracts principles from user feedback and edits
4. **Compare**: Fetch current messaging rules from Configuration table
5. **Suggest**: AI agent suggests new or improved messaging rules
6. **Notify**: Send Slack message with suggested improvements

---

### RC-9.0: Message Writer

**Purpose**: Pipeline forecasting and opportunity management.  
**n8n ID**: `x2h6E15ZPmjDTADC`  
**Status**: ⏸️ Inaktiv (Utility)

**Process**: Update status → Auto-calculate probability & value.

---

### Deprecated Workflows

- **Manual Post-Interaction Logging (WF 4.3)**: Log meetings/calls manually via Airtable form → LoggedInteractions
- **Proactive LinkedIn Engagement**: Merged into RC-3.0 Comment Suggester

---

## AI Agents

| Agent | Model | Role | Workflow |
|-------|-------|------|----------|
| **Research Analyst** | Claude Sonnet | Deep research on contacts | RC-2.0 |
| **Meeting Preparer** | Claude Sonnet | Generates meeting briefings | RC-2.1 |
| **Engagement Strategist** | Claude Sonnet | Generates outreach suggestions | RC-3.0 |
| **Interaction Summarizer** | OpenAI GPT | Summarizes logged interactions | RC-4.0 |
| **Message Coach** | Anthropic Claude | Learns from feedback and suggests improvements | RC-5.0 |
| **Pipeline Analyst** | GPT-4o | Forecasts opportunities | RC-9.0 |

---

## Risks & Security

| Risk | Guardrail |
|------|-----------|
| **Over-automation** | Human-in-the-loop for all outreach |
| **Privacy concerns** | Data stored in Airtable with access controls |
| **Spam detection** | Low-effort interactions prioritized to maintain authenticity |

---

## Backlog

### Paused
- **WF 4.0: AI-driven Lead Generation** - Paused. Purpose: Create leads from text query via Apollo. Process: Interpret query → Search Apollo → Scrape → Save to ColdLeads (New). Related inactive workflows found: "Cold Lead Qualification", "Cold Lead Scraper", "Cold Lead Outreach Generation Engine".

### High Priority
- Enhanced feedback learning loop
- Multi-channel engagement optimization

### Medium Priority
- Advanced segmentation logic
- Integration with additional data sources

### Low Priority
- Advanced analytics dashboard
- WF 4.7: "3-Bullet Briefing" - Quick check before calls (may be embedded in Extended Research)

---

## Related Documents

- [Airtable Schema](../databases/relationship-base/schema.md)
- [System Dependencies](../dependencies.md)
- [System README](../README.md)
- [Workflow Inventory](../../../workflows/inventory.md)
- [Workflow Diagrams](./workflow-diagram.md) - Visual Mermaid diagrams explaining workflow flows

---

**Last Updated**: 2025-12-24  
**Next Review**: On major changes or quarterly

