# RankPilot — Implementation Progress & Architectural Overview

**AI-Powered SEO Analyzer, Ranking Predictor & Optimization Platform**
*4th-Year CSE Final Project*

---

## 1. System Architecture & Live Services

```
┌─────────────────────────────────────────────────────────────┐
│                 Client (React 19 + Vite 8)                  │
│   Tailwind CSS · Inter & JetBrains Mono · Recharts · Lucide │
│   Port: http://localhost:5173                               │
└──────────────────────────────┬──────────────────────────────┘
                               │ REST + JWT
┌──────────────────────────────▼──────────────────────────────┐
│                  Node.js + Express Server                   │
│   Port: http://localhost:5000                               │
│                                                             │
│   [Modules Implemented]                                     │
│   1. Auth & Session Management (JWT, bcryptjs)              │
│   2. Multi-Domain Project Management                        │
│   3. 30+ On-Page & Technical SEO Analyzer (Cheerio, Axios)  │
│   4. Live Google India SERP Tracker (ValueSERP API)         │
│   5. Generative AI Code Fixes (Google Gemini 1.5 Flash API)  │
│   6. Performance Telemetry (Google PageSpeed Insights API)  │
│   7. Exportable Executive & Technical Audit Reports         │
└──────────────────────────────┬──────────────────────────────┘
                               │
               ┌───────────────┴───────────────┐
               ▼                               ▼
       MongoDB Atlas Cluster          External SEO APIs
    (cluster0.agmlwsd.mongodb.net)    · ValueSERP (India)
                                      · Google Gemini 1.5 Flash
                                      · Google PageSpeed API
```

---

## 2. Completed Milestones

### Module 1: Authentication & Monitored Properties
- **Design:** Clean, human-designed authentication card (max-width 400px, warm off-white `#FAFAF8`, forest green `#1B4332`, warm sand `#D4A373`).
- **Demo User:** Single-click "Autofill Demo Credentials" (`demo@rankpilot.in` / `demo123456`).
- **Pre-Loaded Indian Case Studies:**
  1. `indiamart.com` — IndiaMART B2B Marketplace (Rank #1 in B2B terms)
  2. `nykaa.com` — Nykaa Beauty & Cosmetics
  3. `carwale.com` — CarWale Automotive Portal
  4. `practo.com` — Practo Healthcare & Doctor Consultations
  5. `zerodha.com` — Zerodha Broking Fintech Portal
- **CRUD Operations:** Add website, configure target search keywords, remove website, filter by region.

### Module 2: On-Page SEO Analyzer & Google Gemini Integration
- **Engine:** Real HTTP crawl with User-Agent spoofing, HTTP status codes, server TTFB calculation.
- **30+ SEO Checks:**
  - Title presence, character length (30-65 chars), target keyword placement
  - Meta description presence, length (120-160 chars), target keyword presence
  - Heading architecture (single semantic H1, H2-H3 subheadings hierarchy)
  - Image ALT coverage & missing count
  - Canonical URL validation & duplicate content protection
  - Robots & X-Robots directives (`noindex` / `nofollow` warnings)
  - Open Graph tags (`og:title`, `og:description`, `og:image`)
  - Schema.org JSON-LD structured data detection
  - Content word count, keyword density (0.5% - 2.5%), first 100 words placement
  - Link architecture (internal vs. external PageRank flow)
  - Security (HTTPS, UTF-8 charset, mobile viewport)
- **Scoring Algorithm:** Weighted 0–100 SEO Health Score divided into On-Page, Technical, Content, and Performance categories.
- **Google Gemini 1.5 Flash AI Fixes:** Generates structured code blocks (custom meta tags, semantic headings, and JSON-LD LocalBusiness schema) ready to copy in one click.

### Module 3: Google India SERP Rank Tracker
- Integrated with ValueSERP targeting `google.co.in` (GL: `in`, Location: `India`).
- Evaluates organic position for target keywords (#1–#50+).
- Displays top competitor leaders in Google India SERP.

### Module 4: Audit Reports & Settings
- Executive reports previewing category grades and issue findings.
- Native printable PDF layout (`window.print()`).
- Settings dashboard showing live connected API connectors and regional defaults.

---

## 3. How to Test & Access

1. **Frontend Application:** Open `http://localhost:5173/` in your browser.
2. **Login:** Click **"Autofill Demo Credentials"** (`demo@rankpilot.in` / `demo123456`) and click **Sign in**.
3. **Dashboard:** Review the monitored Indian case-study domains and high-level health metrics.
4. **On-Page Audit:** Click **Analyze**, enter any URL (e.g. `https://example.com` or `https://indiamart.com`), and click **Run Full Audit**.
5. **AI Code Fixes:** Click the **AI Generated Fixes** tab to copy synthesized HTML and JSON-LD tags.
6. **Rankings:** Go to **Rankings** to check live organic Google India SERP positions.
