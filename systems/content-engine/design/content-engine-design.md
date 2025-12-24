# Content Engine - Design Document

**Version**: 4.9 | **Date**: 2025-12-24 | **Status**: Live (Driftssatt)  
**Author**: Christian Fredriksson

> **Single Source of Truth**: Detta dokument är den centrala och auktoritativa källan för Content Engine. Det beskriver systemets arkitektur, datamodeller och aktiva processer.

---

## 📋 Innehållsförteckning

1. [Översikt & Omfattning](#översikt--omfattning)
2. [Vision & Strategi](#vision--strategi)
3. [Systemarkitektur](#systemarkitektur)
4. [Datamodell](#datamodell)
5. [Workflows](#workflows)
6. [AI-Agenter](#ai-agenter)
7. [Risker & Säkerhet](#risker--säkerhet)
8. [Backlog](#backlog)

---

## Översikt & Omfattning

### Inom ramen (In-Scope)

| Funktion | Workflow | Beskrivning |
|----------|----------|-------------|
| **Dynamisk Nyhetsbevakning** | WF-4.1 | Automatiserad insamling från källor definierade i Airtable |
| **Innehållsberikning** | WF-4.4 | Insight Gathering: manuell trigger via statusändring, konversationell chat-intervju |
| **Innehållsproduktion** | WF-4.2 | Helautomatiserad generering av textutkast och bilder |
| **Prestandaanalys & Trendspaning** | WF-4.3 | Automatisk uppdatering av data och strategisk analys |
| **Coachning & Lärande** | WF-4.3 | Kvalitativ analys av feedback |

### Utanför ramen (Out-of-Scope)

- ❌ Automatisk publicering utan statusen 🚀 Ready to Publish
- ❌ "Golden Window"-automation (hanteras manuellt)
- ❌ Engagement Engine (hanteras i separat designdokument)

---

## Vision & Strategi

### Vision

> Att bygga en semi-autonom motor som systematiskt identifierar signaler, transformerar dem till högkvalitativt, personligt varumärkesbyggande innehåll på LinkedIn, och proaktivt skapar engagemang för att bygga relationer och förbli "top of mind" hos en definierad målgrupp.

### Problemformulering

Att producera relevant och engagerande innehåll på en konsekvent basis är tidskrävande. Att dessutom hinna med att strategiskt interagera med sitt nätverk är en ännu större utmaning. Manuell hantering av idéer, utkast, publicering och engagemang leder ofta till inkonsekvens och missade möjligheter.

### Kärnfilosofi: "Systematisk Autenticitet"

| Princip | Beskrivning |
|---------|-------------|
| **1. Insight Driven** | Systemet prioriterar användarens unika insikter och röst över externa nyheter. Tekniken används för att extrahera och förädla dessa tankar. |
| **2. Human-in-the-Loop** | Systemet förstärker, men ersätter aldrig, mänskligt omdöme. Allt innehåll och all extern kommunikation kräver ett manuellt godkännande-steg. |
| **3. Proaktiv Partner** | AI:ns output är inte bara ett passivt utkast, utan ett proaktivt, strategiskt förslag designat för att utmana och påskynda den kreativa processen. |

---

## Systemarkitektur

### Kärnkomponenter

#### Orkestrering & Databas
- **Orkestrering**: n8n
- **Databas**: Airtable (Bas: "Artisan")
  - Se [Schema dokumentation](../databases/artisan-base/schema.md) för detaljerad struktur

#### AI-Modeller

| Användning | Modell | Version |
|------------|--------|---------|
| Textanalys & Skapande | Anthropic Claude Sonnet | 3.5/4.5 |
| Bildgenerering & Vision | Google Gemini | Imagen 3/Flash |
| Strategisk Analys | OpenAI GPT-4o | - |
| Tal-till-Text | OpenAI Whisper | - |

#### Gränssnitt

- **Slack**: Notifikationer, röstmeddelanden, textbaserad dialog
- **GitHub Pages**: Custom chat-gränssnitt för intervjuer (WF-4.4)
- **ChatGPT Custom GPT**: Realtids röstkonversation ("Qyrios Partner") - planerad

#### Data & Verktyg

- **Apify**: LinkedIn-skrapning
- **RSS-läsare**: Nyhetsinsamling
- **Perplexity/Google Search**: Trendspaning

---

## Datamodell

### Airtable Base: Artisan

**Länk**: [Fullständigt schema](../databases/artisan-base/schema.md)

### Kärntabeller

| Tabell | Syfte | Används av |
|--------|-------|------------|
| **Content** | Central hub för all innehållsproduktion | Alla workflows |
| **Sources** | Hanterar RSS-källor dynamiskt | News Analyser |
| **Content Feedback** | Strukturerad, kvalitativ feedback | Writing Coach |
| **Suggested Improvements** | Backlog för AI-genererade förbättringsförslag | Agent Improver |
| **Brand Guide** | Systemets "konstitution" | Alla workflows |
| **News** | Hanterar nyheter från RSS-källor | News Analyser |
| **Error Logger** | Loggar fel från workflow-exekveringar | Alla workflows |

---

## Workflows

### WF-4.1: News Filtering Engine ("News Editor")

**Agent**: News Analyser  
**Trigger**: Dagligen kl 05:00  
**Status**: ✅ Production

**Processflöde**:
```
Hämta Källor → RSS-läsning → Filtrering & Analys → 
Beslut (Idea Backlog/Refuserad) → Rapport till Slack
```

**Använder**: Sources, Content (Airtable)

---

### WF-4.2: Content Production Engine ("Content Producer")

**Agent**: Content Writer, Image Generator  
**Trigger**: Varje timme (schemalagt)  
**Status**: ✅ Production

**Processflöde**:
```
Textgenerering (PersonalReflection/Nyheter) → 
Bildgenerering → 
Publicering (om datum passerat & Ready) → 
Notis till Slack
```

**Använder**: Content (Airtable)

---

### WF-4.3: Content Coach & Performance

**Agent**: Strategy Analyst, Writing Coach  
**Status**: ✅ Production

#### 4.3.1 Qualitative Coaching
- **Trigger**: Söndagar 10:00
- **Process**: Jämför utkast med final text → Analyserar feedback → Skapar förslag i Suggested Improvements

#### 4.3.2 Quantitative Strategy & Trend Scouting
- **Workflow**: Performance Analyser
- **Trigger**: Fredagar 02:00
- **Process**: 
  - Performance Analyser: Beräknar engagement score → Identifierar Top 10 → Spanar trender (Perplexity) → Matchar mot Backlog → Skickar veckorapport till Slack

#### 4.3.3 LinkedIn Performance Retriever
- **Workflow**: LinkedIn Performance Retriever (Data fetcher för WF-4.3.2)
- **Trigger**: Fredagar 02:00 (körs före Performance Analyser)
- **Process**: 
  - Skrapar LinkedIn-statistik (Apify) → Uppdaterar Airtable med Reactions, Comments, Reposts

**Använder**: Content, Content Feedback, Suggested Improvements (Airtable)

---

### WF-4.4: Insight Gathering Engine

**Agent**: Insight Gatherer  
**Trigger**: Statusändring till "💬 Interview" i Airtable  
**Status**: ✅ Production (Konversationell chat via GitHub Pages)

**Arkitektur**: Två workflows + custom chat-gränssnitt

#### WF-4.4: Interview Trigger
**Syfte**: Detekterar statusändring och skickar chat-länk till Slack

**Processflöde**:
```
Statusändring (Airtable Webhook) → 
Hämta Content record → 
Hämta Founder Info → 
Generera Chat URL (med metadata: recordId, title, topic, summary) → 
Skicka förenklad länk till Slack (#content-interview)
```

**Slack-meddelande format**:
```
💬 Dags för intervju!
Innehåll: [titel]
Börja den konversationella intervjun  ← klickbar länk
```

#### WF-4.4b: Interview Chat
**Syfte**: Backend för den konversationella intervjun

**Processflöde**:
```
Chat Trigger (webhook mode) → 
Extrahera recordId från metadata → 
Hämta Content + Founder Info (parallellt) → 
Sammanfoga kontext → 
Förbered kontext → 
AI Interviewer Agent
  ├─> Claude Sonnet 4.5 (språkmodell)
  ├─> Simple Memory (konversationshistorik)
  └─> Save Insights Tool (Airtable Tool)
```

#### Chat-gränssnitt (GitHub Pages)
**URL**: `https://grollens.github.io/qyrios-ai-agents/interview-chat.html`
**Fil**: `docs/interview-chat.html`

**Design**:
- Custom header: "INTERVJU FÖR NYTT CONTENT" (label) + innehållets titel + ämne
- Embedded n8n chat widget (@n8n/chat)
- Initial sammanfattning av innehållet visas vid start
- Fast bredd (600px desktop, 100% mobil)
- Rensat från n8n:s default header

**URL-parametrar** (skickas från WF-4.4):
- `recordId`: Airtable record ID (required)
- `title`: Innehållets titel
- `topic`: Ämne/kategori
- `summary`: Sammanfattning (max 200 tecken)

**Nyckelfunktioner**:
- **En fråga i taget**: Mer engagerande än batch-frågor
- **Adaptiva följdfrågor**: AI anpassar sig baserat på svar
- **Konversationsminne**: Bevarar kontext genom hela sessionen
- **Direkt start**: AI börjar omedelbart med relevant fråga (ingen generisk hälsning)
- **Auto-save**: När användaren säger "klar" sparas insikter automatiskt

**Använder**: 
- Content (Airtable)
- Brand Guide (Airtable) - founder_info
- Slack (#content-interview) - för notifikationer
- GitHub Pages - för chat-gränssnittet
- n8n Chat Trigger (webhook mode) - för backend

**Notera**: 
- Status `💬 Interview` måste finnas i Airtable Status-fält
- Användaren måste skriva "klar" för att spara insikter
- AI bekräftar att insikter sparats
- Status ändras till "✍️ Draft Text" efter sparning

---

### WF-4.7: LinkedIn Historical Posts Backfill

**Purpose**: One-time workflow to import historical LinkedIn posts into Content Database for statistics and analysis  
**Trigger**: Manual  
**Status**: ✅ Implemented

**Processflöde**:
```
Manual Trigger → 
Fetch LinkedIn Posts (Apify) → 
Get Dataset Items (Apify) → 
Split Posts → 
Extract Post Data → 
Check Existing Posts by Date (Airtable) → 
Fuzzy Text Matching (duplicate detection) → 
Is Duplicate? (If node)
  ├─→ [True/Duplicate] → Summary Results
  └─→ [False/New] → Create Airtable Record → Summary Results
```

**Använder**: 
- Apify (LinkedIn posts scraper)
- Content (Airtable)

**Funktioner**:
- Intelligent duplicate detection using date filtering + fuzzy text matching (80% threshold)
- Handles text differences between published posts and Airtable (user edits after publishing)
- Extracts engagement metrics (reactions, comments, reposts, views)
- Generates summary statistics (new posts added, duplicates skipped)

**Notera**: 
- One-time workflow for backfilling historical data
- Uses fuzzy text matching on opening paragraph (first 250 chars) to handle minor edits
- All imported posts have Status: "✅ Published"

---

### WF-4.8: Create Draft from Slack

**Purpose**: Quick draft creation from Slack messages  
**Trigger**: Manual (Slack command or message)  
**Status**: ✅ Production

**Processflöde**:
```
Slack Message/Command → 
Parse Content → 
Create Airtable Record → 
Confirm in Slack
```

**Använder**: 
- Slack (input)
- Content (Airtable)

**Notera**: 
- Enables quick content creation without opening Airtable
- Creates draft records ready for refinement

---

## AI-Agenter

| Agent | Modell | Roll | Workflow |
|-------|--------|------|----------|
| **News Analyser** | OpenAI/Claude | Gatekeeper. Filtrerar brus. | WF-4.1 |
| **Content Writer** | Claude Sonnet | Kreativ strateg. Story First. | WF-4.2 |
| **Image Generator** | Gemini | Visuell skapare. Metaforiska bilder. | WF-4.2 |
| **Strategy Analyst** | GPT-4o | Datadriven chefredaktör. | WF-4.3 |
| **Writing Coach** | Claude/OpenAI | Pedagog. Analyserar ändringar. | WF-4.3 |
| **Insight Gatherer** | Claude Sonnet | Interviewer. Lockar fram personliga perspektiv och erfarenheter via strukturerad Q&A. | WF-4.4 |

---

## Risker & Säkerhet

| Risk | Guardrail |
|------|-----------|
| **"System-smak" på texter** | Prioritera PersonalReflection, mänskligt språk |
| **Hallucinationer** | Attribution Rule (källhänvisning/verifiering) |
| **Spam-filter** | Publiceringstakten är begränsad |

---

## Backlog

### Hög prioritet
- **B-1**: "Curator Post"-flöde

### Medel prioritet
- **B-2**: Strategisk Schemaläggning (Helger)
- **B-3**: Utökad Kunskapsbas för Sparringpartner

### Planerade Features (Ej ännu implementerade)

#### Workflows
- **B-4**: Conversational Engine ("Intellektuell Sparringpartner")
  - **Agent**: Sparring Partner
  - **Status**: Planerad (separat från WF-4.4 Interview)
  - **Beskrivning**: Interaktiv AI-partner för textbaserad fördjupning i Slack, fokuserad på idéutveckling snarare än insiktsextraktion
  - **Notera**: Eventuell status 💬 Bollplank för att skilja från Interview

- **B-5**: WF-4.5 - Insight Extraction Engine (Async Voice)
  - **Agent**: The Interviewer
  - **Status**: Planerad men inte implementerad
  - **Beskrivning**: Röst-loop via Slack (#content-ideas) för snabba idéer
  - **Notera**: Status 🧠 Insight Processing var planerad för denna workflow

- **B-6**: WF-4.6 - Real-time Voice Interface ("Qyrios Partner")
  - **Agent**: Custom GPT Integration
  - **Status**: Planerad men inte implementerad
  - **Beskrivning**: Realtids röstkonversation via Custom GPT för djupa, utforskande samtal

#### Status-värden i Airtable
- **B-7**: 🔔 Golden Window - Status för optimal publiceringstid (nämns i design men hanteras manuellt för närvarande)

#### Airtable Tabeller
- **B-8**: Strategic Themes - Tabell för planering och kategorisering av innehåll
  - **Fält**: Theme (Single Select), Key Questions (Long text), Content (Link)
  - **Används av**: Strategy Analyst (WF-4.3)
  - **Status**: Planerad men inte implementerad

- **B-9**: Chat Sessions - Tabell för att logga konversationssessioner
  - **Fält**: SessionID (Autonumber), Content Link (Link), Slack Thread ID (Text), Status (Single Select: Open/Closed), Full Transcript (Long text)
  - **Används av**: Insight Gatherer (WF-4.4), Sparring Partner (B-4)
  - **Status**: Planerad men inte implementerad

---

## Relaterade Dokument

- [Airtable Schema](../databases/artisan-base/schema.md)
- [System Dependencies](../dependencies.md)
- [System README](../README.md)
- [Workflow Inventory](../../../workflows/inventory.md)

---

**Senast uppdaterad**: 2025-12-24  
**Nästa granskning**: Vid större ändringar eller varje kvartal

---

## Verifiering & Uppdateringar

**Verifierad**: 2025-12-24  
**Verifierad mot**: n8n workflows med tag "Content Production"

### Verifierade Workflows
- ✅ WF-4.1: News Editor (n8n: "CE: News Editor (WF-4.1)")
- ✅ WF-4.2: Content Production (n8n: "CE: Content Production (WF-4.2)")
- ✅ WF-4.3.1: Content Coach (n8n: "CE: Content Coach (WF-4.3.1)")
- ✅ WF-4.3.2: Performance Analyser (n8n: "CE: Performance Analyser (WF-4.3.2)")
- ✅ WF-4.3.3: LinkedIn Performance Retriever (n8n: "CE: LinkedIn Performance Retriever (WF-4.3.3)")
- ✅ WF-4.4: User Interview (n8n: "CE: User Interview (WF-4.4)")
- ✅ WF-4.4b: Interview Chat (n8n: "CE: Interview Chat (WF-4.4b)")
- ✅ WF-4.7: LinkedIn Historical Posts Backfill (n8n: "CE: LinkedIn Historical Posts Backfill (WF-4.7)")
- ✅ WF-4.8: Create Draft from Slack (n8n: "CE: Create Draft from Slack (WF-4.8)")

**Notera**: Alla workflows är aktiva och tillhör projektet "Qyrios Agents" (tidigare "Qyrios Testing Ground").
