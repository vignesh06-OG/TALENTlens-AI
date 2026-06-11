<div align="center">

# ⚡ TalentLens AI

### Intelligent Candidate Discovery — Don't filter talent. *Discover it.*

**Data & AI Challenge Submission · Hackathon PoC**

*An AI recruiter that reads job descriptions like a human, matches skills semantically (beyond keywords), fuses profile + career + activity signals, and ranks every candidate with a fully explainable score — all in under 50ms, entirely in the browser.*

`HTML` · `CSS` · `Vanilla JS` · `Zero dependencies` · `Zero backend` · `1 file`

</div>

---

## 🎯 The Problem

Traditional ATS / recruitment tools **filter** candidates with boolean keyword search:

> *"Has 'React'? ✓ Pass. Wrote 'ReactJS' instead? ✗ Rejected."*

This throws away great candidates and surfaces mediocre ones. The challenge: build a system that doesn't just filter, but **intelligently ranks** — with deep job understanding, contextual relevance beyond keywords, and full signal integration.

## 💡 What We Built

**TalentLens AI** is a single-file, client-side **Intelligent Candidate Discovery engine** with a futuristic 3D dashboard UI. Paste *any* job description → it parses the JD, semantically expands it over a skill-ontology graph, scores every candidate across **4 fused signals**, and produces an **explainable, tunable ranking**.

### Mapping to the 3 challenge pillars

| Challenge Pillar | Our Implementation |
|---|---|
| **Deep Job Understanding** | NLP-style JD parser — extracts skills, seniority level, minimum years, domain; classifies **must-have vs nice-to-have** using section + line context (must-haves get 2× weight) |
| **Contextual Relevance** | **100+ node skill-ontology graph** with 30+ aliases. `RAG ≈ LangChain`, `k8s → Kubernetes`, `GenAI → LLM`. Exact match = 1.0, related skill = 0.62, same-category = 0.3 — *semantic fit, not string match* |
| **Signal Integration** | 4 signals fused with **live-tunable weights**: Semantic Fit, Experience, Career Trajectory, Activity/Behavioral |

### ✨ Bonus: Explainable AI

Every candidate gets a **"Why ranked #N"** natural-language explanation — no black box:

> *"7/16 required skills matched exactly (machine learning, llm, python, pytorch…) · 8 matched semantically — e.g. has **llm** which transfers to **transformers** · 4 yrs experience meets the 3+ yr bar · actively job-seeking & online this week"*

---

## 🧠 How It Works

```
                       ┌──────────────────────────────────────────────┐
  Job Description ───▶ │ 1. DEEP JOB UNDERSTANDING                    │
  (paste anything)     │    skills · must/nice · seniority · years    │
                       └──────────────────┬───────────────────────────┘
                                          ▼
                       ┌──────────────────────────────────────────────┐
                       │ 2. SEMANTIC EXPANSION                        │
                       │    ontology graph: 1-hop neighbours          │
                       │    earn partial credit (RAG ≈ LangChain)     │
                       └──────────────────┬───────────────────────────┘
                                          ▼
  Talent Pool ───────▶ ┌──────────────────────────────────────────────┐
  (120 synthetic or    │ 3. MULTI-SIGNAL SCORING (per candidate)      │
   your CSV/JSON)      │    ① Semantic Fit   45%  ─┐                  │
                       │    ② Experience     20%   ├─ tunable live    │
                       │    ③ Career Signal  15%   │  via sliders     │
                       │    ④ Activity       20%  ─┘                  │
                       └──────────────────┬───────────────────────────┘
                                          ▼
                       ┌──────────────────────────────────────────────┐
                       │ 4. EXPLAINABLE RANKING                       │
                       │    score 0-100 · tier · signal breakdown     │
                       │    "why ranked #N" reasoning · CSV export    │
                       └──────────────────────────────────────────────┘
```

### Signal details

**① Semantic Fit (default 45%)** — Weighted ontology match over JD skills. Must-haves count 2×. Match types: `exact (1.0)` / `related via graph edge (0.62)` / `same category (0.3)` / `miss (0)`.

**② Experience (20%)** — Smooth curve around the JD's required years: under-experience decays exponentially, over-qualification decays gently (a 15-yr veteran isn't automatically "better" for a 3-yr role). Title-level alignment bonus.

**③ Career Signal (15%)** — Career trajectory (role progression), tenure health (2–4.5 yr average = ideal; <1.2 yr = switching-risk flag), education tier, certifications.

**④ Activity / Behavioral (20%)** — Recency of platform activity, open-to-work status, historical response rate, profile completeness, GitHub commit activity. *This is what makes a "reachable & responsive" candidate outrank a ghost profile.*

---

## 🖥️ Features

- 🎨 **Khatarnak UI** — dark futuristic theme, 3D floating candidate-card scene, particle constellation canvas, glassmorphism, mouse-parallax tilt on cards, neon glow accents, animated count-ups
- ⚡ **<50ms ranking** of 120 candidates — re-ranks *live* as you drag weight sliders
- 📋 **4 one-click JD presets** (Frontend / ML / DevOps / Data Scientist) + paste-anything support
- 📂 **Bring your own talent pool** — drag-drop CSV/JSON upload with a downloadable template
- 📊 **Score distribution histogram** + tier legend (Excellent / Strong / Moderate / Low)
- 🔍 Search + tier + availability filters
- 📤 **Export top-25 shortlist** as CSV (with per-signal scores)
- ♿ Accessible: keyboard navigation, focus states, ARIA labels, `prefers-reduced-motion` support
- 📱 Responsive: 375px → 1440px+

---

## 🚀 Run It

No build. No install. No server needed.

```bash
git clone https://github.com/vignesh06-OG/TALENTlens-AI.git
cd TALENTlens-AI
# Option A: just open it
open index.html          # macOS
start index.html         # Windows
# Option B: serve it (recommended for clean fonts/CORS)
python3 -m http.server 8000   # → http://localhost:8000
```

### Demo flow (90 seconds, judge-ready)

1. Click **"Run Instant Demo"** in the hero → ML Engineer JD auto-loads & ranks
2. Show the **Deep Job Understanding** panel — parsed must-haves vs nice-to-haves
3. Expand candidate **#1** → signal bars, skill evidence (`✓ exact` / `≈ semantic via X`), **"Why ranked #1"**
4. Drag the **Activity slider to 80%** → watch the whole ranking reshuffle live
5. Upload your own CSV (template downloadable in-app) → instant re-rank
6. **Export shortlist** → CSV with full per-signal breakdown

### CSV format

```csv
name,title,location,years_experience,skills,num_jobs,avg_tenure_years,current_company,education,certifications,last_active_days,open_to_work,response_rate,profile_complete,github_commits_6mo
Asha Verma,Senior ML Engineer,Bengaluru,6,python;pytorch;llm;rag;mlops;docker,3,2.0,Sarvam AI,M.Tech,GCP Professional ML,2,yes,92,95,310
```
Only `name` + `skills` are required — everything else gets sensible defaults. Skills accept `;` `|` or `,` separators and all aliases (`k8s`, `GenAI`, `sklearn`…).

---

## 🧪 Testing

The scoring engine is pure-function JS (no DOM dependency), so it's testable headlessly with Node:

```bash
node tests/engine.test.js
```

Validates: JD parsing (must/nice classification, seniority, years) · semantic matching · ranking discrimination across 4 different JDs (ML JD ranks ML engineers on top, FE JD ranks frontend on top, etc.) · CSV parser (quoted fields) · explainability output.

Manual QA checklist: responsive at 375/768/1024/1440 · keyboard-only navigation · `prefers-reduced-motion` honoured · file upload edge cases (empty CSV, malformed JSON).

---

## 🏗️ Architecture & Tech Choices

| Decision | Why |
|---|---|
| **Single HTML file, vanilla JS** | Zero-friction demo — judges open one file. No build pipeline failures at 3am. Full engine code is readable in one place |
| **Client-side ranking** | Privacy by default (candidate data never leaves the browser), zero infra cost, instant latency |
| **Hand-built ontology over embeddings API** | Deterministic, explainable, offline-capable, free. The architecture is embedding-ready (see roadmap) |
| **Seeded RNG for synthetic data** | Reproducible demos — same 120 candidates every load |

## 🔮 Future Scope

**Engine upgrades**
- Swap ontology for **real embeddings** (sentence-transformers / OpenAI `text-embedding-3`) + vector DB (Pinecone/Qdrant) for true semantic search at scale
- **Resume PDF parsing** (upload resumes directly, not just CSV)
- **Learning-to-rank**: train on recruiter accept/reject feedback (LambdaMART / cross-encoder re-ranking)
- **Bias & fairness auditing** — demographic-blind scoring mode, disparate-impact reports
- Multi-JD batch mode: rank one pool against many open roles simultaneously

**Productization**
- FastAPI/Node backend + Postgres for persistent pools and team collaboration
- Browser extension: rank LinkedIn search results in-place
- Outreach integration: auto-draft personalized messages for top-N using an LLM

**Where this can be integrated 🌍**
- **ATS platforms** (Greenhouse, Lever, Zoho Recruit) as a ranking layer via API
- **Job portals** (Naukri, LinkedIn, Indeed) — two-sided matching: candidates ↔ jobs
- **Campus placement cells** — rank student pools against company JDs
- **Staffing/consulting agencies** — bench allocation against client requirements
- **Internal mobility (HRMS)** — match existing employees to internal openings
- **Freelance marketplaces** (Upwork-style) — gig ↔ talent matching
- Beyond hiring: the same ontology-ranking core works for **mentor-mentee matching, co-founder matching, hackathon team formation**

## 📁 Project Structure

```
TALENTlens-AI/
├── index.html          # The entire app: UI + 3D layer + discovery engine
├── tests/
│   └── engine.test.js  # Headless engine tests (Node)
├── sample-data/
│   └── talent_pool_sample.csv
└── README.md
```

---

<div align="center">

**Built for the Data & AI Challenge — Intelligent Candidate Discovery** 🏆

*Deep Job Understanding · Semantic Relevance · Signal Fusion · Explainable Ranking*

</div>
