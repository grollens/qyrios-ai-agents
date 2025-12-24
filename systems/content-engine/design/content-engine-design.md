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
| **Dynamisk Nyhetsbevakning** | CE-1.0 | Automatiserad insamling från källor definierade i Airtable |
| **Snabb-input** | CE-1.1 | Quick Draft: skapa innehåll direkt från Slack |
| **Innehållsberikning** | CE-2.x | Insight Gathering: konversationell chat-intervju |
| **Innehållsproduktion** | CE-3.0 | Helautomatiserad generering av textutkast och bilder |
| **Prestandaanalys & Trendspaning** | CE-4.x | Automatisk uppdatering av data och strategisk analys |
| **Coachning & Lärande** | CE-5.0 | Kvalitativ analys av feedback |

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

### Namnkonvention

**Format**: `CE-X.Y` där:
- **CE** = Content Engine
- **X** = Fas (1=Input, 2=Enrichment, 3=Production, 4=Analysis, 5=Learning, 9=Utility)
- **Y** = Workflow inom fasen

---

### CE-1.0: News Editor

**Agent**: News Analyser  
**Trigger**: Dagligen kl 05:00  
**Status**: ✅ Production  
**n8n ID**: `xhrCoul7OWH796Kb`

**Processflöde**:
```
Hämta Källor → RSS-läsning → Filtrering & Analys → 
Beslut (Idea Backlog/Refuserad) → Rapport till Slack
```

**Använder**: Sources, Content (Airtable)

---

### CE-1.1: Quick Draft

**Syfte**: Snabb skapande av utkast från Slack  
**Trigger**: Slack-kommando  
**Status**: ✅ Production  
**n8n ID**: `QhTdveZN836tTp3W`

**Processflöde**:
```
Slack Message/Command → Parse Content → 
Create Airtable Record → Confirm in Slack
```

**Använder**: Slack, Content (Airtable)

---

### CE-2.0: Interview Trigger

**Agent**: Insight Gatherer  
**Trigger**: Statusändring till "💬 Interview" i Airtable  
**Status**: ✅ Production  
**n8n ID**: `0uivucNHZe4cXtxT`

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

---

### CE-2.1: Interview Chat

**Syfte**: Backend för den konversationella intervjun  
**Trigger**: Chat webhook (från GitHub Pages)  
**Status**: ✅ Production  
**n8n ID**: `MH2X99khIhTvTa1R`

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

---

### CE-3.0: Content Production

**Agent**: Content Writer, Image Generator  
**Trigger**: Varje timme (schemalagt)  
**Status**: ✅ Production  
**n8n ID**: `QT0qhhlrHwdW0Qc6`

**Processflöde**:
```
Textgenerering (PersonalReflection/Nyheter) → 
Bildgenerering → 
Publicering (om datum passerat & Ready) → 
Notis till Slack
```

**Använder**: Content (Airtable)

---

### CE-4.0: Performance Retriever

**Syfte**: Hämtar LinkedIn-statistik (Data fetcher för CE-4.1)  
**Trigger**: Fredagar 02:00  
**Status**: ✅ Production  
**n8n ID**: `QjdBaF25Bxnz1ulQ`

**Processflöde**:
```
Skrapar LinkedIn-statistik (Apify) → 
Uppdaterar Airtable med Reactions, Comments, Reposts
```

**Använder**: Apify, Content (Airtable)

---

### CE-4.1: Performance Analyser

**Agent**: Strategy Analyst  
**Trigger**: Fredagar 02:00 (efter CE-4.0)  
**Status**: ✅ Production  
**n8n ID**: `L69usft0w47kmOem`

**Processflöde**:
```
Beräknar engagement score → Identifierar Top 10 → 
Spanar trender (Perplexity) → Matchar mot Backlog → 
Skickar veckorapport till Slack
```

**Använder**: Content, Content Feedback, Suggested Improvements (Airtable)

---

### CE-5.0: Content Coach

**Agent**: Writing Coach  
**Trigger**: Söndagar 10:00  
**Status**: ✅ Production  
**n8n ID**: `B7VQMNvOXmeaf6Gx`

**Processflöde**:
```
Jämför utkast med final text → Analyserar feedback → 
Skapar förslag i Suggested Improvements
```

**Använder**: Content, Content Feedback, Suggested Improvements (Airtable)

---

### CE-9.0: LinkedIn Backfill

**Syfte**: Engångs-import av historiska LinkedIn-inlägg  
**Trigger**: Manuell  
**Status**: ✅ Production  
**n8n ID**: `MSATKEg7V1JqySb0`

**Processflöde**:
```
Manual Trigger → Fetch LinkedIn Posts (Apify) → 
Split Posts → Extract Data → 
Check Duplicates (fuzzy matching 80%) → 
Create/Skip Records → Summary
```

**Använder**: Apify, Content (Airtable)

---

### Interview Chat-gränssnitt (GitHub Pages)

**URL**: `https://grollens.github.io/qyrios-ai-agents/interview-chat.html`  
**Fil**: `docs/interview-chat.html`

**Design**:
- Custom header: "INTERVJU FÖR NYTT CONTENT" (label) + innehållets titel + ämne
- Embedded n8n chat widget (@n8n/chat)
- Initial sammanfattning av innehållet visas vid start
- Fast bredd (600px desktop, 100% mobil)
- Rensat från n8n:s default header

**URL-parametrar** (skickas från CE-2.0):
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

## AI-Agenter

| Agent | Modell | Roll | Workflow |
|-------|--------|------|----------|
| **News Analyser** | OpenAI/Claude | Gatekeeper. Filtrerar brus. | CE-1.0 |
| **Content Writer** | Claude Sonnet | Kreativ strateg. Story First. | CE-3.0 |
| **Image Generator** | Gemini | Visuell skapare. Metaforiska bilder. | CE-3.0 |
| **Strategy Analyst** | GPT-4o | Datadriven chefredaktör. | CE-4.1 |
| **Writing Coach** | Claude/OpenAI | Pedagog. Analyserar ändringar. | CE-5.0 |
| **Insight Gatherer** | Claude Sonnet | Interviewer. Lockar fram personliga perspektiv och erfarenheter via strukturerad Q&A. | CE-2.1 |

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
- **B-4**: CE-6.0 - Conversational Engine ("Intellektuell Sparringpartner")
  - **Agent**: Sparring Partner
  - **Status**: Planerad (separat från CE-2.x Interview)
  - **Beskrivning**: Interaktiv AI-partner för textbaserad fördjupning i Slack, fokuserad på idéutveckling snarare än insiktsextraktion
  - **Notera**: Eventuell status 💬 Bollplank för att skilja från Interview

- **B-5**: CE-2.2 - Insight Extraction Engine (Async Voice)
  - **Agent**: The Interviewer
  - **Status**: Planerad men inte implementerad
  - **Beskrivning**: Röst-loop via Slack (#content-ideas) för snabba idéer
  - **Notera**: Status 🧠 Insight Processing var planerad för denna workflow

- **B-6**: CE-2.3 - Real-time Voice Interface ("Qyrios Partner")
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
  - **Används av**: Insight Gatherer (CE-2.1), Sparring Partner (B-4)
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

| Kod | n8n Namn | n8n ID | Status |
|-----|----------|--------|--------|
| CE-1.0 | CE-1.0: News Editor | `xhrCoul7OWH796Kb` | ✅ Aktiv |
| CE-1.1 | CE-1.1: Quick Draft | `QhTdveZN836tTp3W` | ✅ Aktiv |
| CE-2.0 | CE-2.0: Interview Trigger | `0uivucNHZe4cXtxT` | ✅ Aktiv |
| CE-2.1 | CE-2.1: Interview Chat | `MH2X99khIhTvTa1R` | ✅ Aktiv |
| CE-3.0 | CE-3.0: Content Production | `QT0qhhlrHwdW0Qc6` | ✅ Aktiv |
| CE-4.0 | CE-4.0: Performance Retriever | `QjdBaF25Bxnz1ulQ` | ✅ Aktiv |
| CE-4.1 | CE-4.1: Performance Analyser | `L69usft0w47kmOem` | ✅ Aktiv |
| CE-5.0 | CE-5.0: Content Coach | `B7VQMNvOXmeaf6Gx` | ✅ Aktiv |
| CE-9.0 | CE-9.0: LinkedIn Backfill | `MSATKEg7V1JqySb0` | ⏸️ Inaktiv (utility) |

**Notera**: Alla workflows tillhör projektet "Qyrios Agents".
