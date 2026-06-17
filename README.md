# 🕯️ Professional ICT Trading Academy

A **100% offline, installable PWA** that teaches **ICT (Inner Circle Trader) strategy, Market Structure and Price Action** from beginner to professional level — through interactive candlestick charts, a replay simulator, quizzes, an offline AI tutor and a certification system.

> Educational software only. Nothing here is financial advice.

![tech](https://img.shields.io/badge/React-18-149eca) ![tech](https://img.shields.io/badge/TypeScript-5-3178c6) ![tech](https://img.shields.io/badge/Tailwind-3-38bdf8) ![tech](https://img.shields.io/badge/Zustand-4-443e38) ![tech](https://img.shields.io/badge/PWA-offline-5a0fc8)

---

## ✨ Features

- **8 learning modules**, 25+ lessons with interactive, animated candlestick charts.
- **Chart engine** (TradingView Lightweight Charts): candlestick / bar / line, volume, auto HH·HL·LH·LL structure labels, order-block / FVG / premium-discount zones, entry / SL / TP price lines, horizontal levels.
- **Replay Simulator**: reveal candles one at a time, place Long/Short trades with SL & TP, auto-evaluated outcomes, R-multiple statistics, saved sessions.
- **Quiz engine**: single / multiple choice, true-false and chart-identify questions, per-question review.
- **Risk calculators**: lot size, risk %, R:R, expectancy and a daily/weekly/monthly drawdown envelope.
- **Progress tracking**: dashboard with overall %, skill radar, strengths & focus areas.
- **Certification**: Beginner → Intermediate → Advanced → Professional ICT Trader, with a printable certificate.
- **Offline AI Tutor**: a curated knowledge base + keyword engine — answers ICT questions with zero network calls.
- **Works fully offline** and is installable to the home screen.

---

## 🧩 Learning Modules

| # | Module | Highlights |
|---|--------|-----------|
| 1 | Japanese Candlesticks | Bullish/Bearish, Doji, Hammer family, Engulfing, Stars, Harami, Tweezers |
| 2 | Market Structure | HH/HL/LH/LL, trends, BOS, CHoCH, internal vs external |
| 3 | Liquidity | BSL/SSL, equal highs/lows, sweeps, stop hunts |
| 4 | Order Blocks | Bullish/Bearish OB, mitigation & breaker blocks, entry/SL/TP |
| 5 | Fair Value Gap | Bullish/Bearish FVG, 50% fill, inversion FVG |
| 6 | Premium & Discount | Fibonacci range, equilibrium, OTE |
| 7 | ICT Entry Models | Sweep+MSS, OB/FVG entries, SMT, Judas swing, kill zones |
| 8 | Risk Management | R:R, position sizing, drawdown limits, calculators |


---

## 🏗️ System Architecture

```
┌─────────────────────────────────────────────────────────────┐
│                        React UI (Pages)                       │
│  Dashboard · Module · Lesson · Quiz · Replay · ChartLab ·     │
│  Risk · Exam · Certificates · Tutor · Settings                │
└───────────────┬───────────────────────────┬──────────────────┘
                │                            │
        ┌───────▼────────┐          ┌────────▼─────────┐
        │  Zustand Stores │          │  Components       │
        │  progress       │          │  chart/ (engine)  │
        │  settings       │          │  quiz/ lesson/ ui/│
        │  replay         │          │  layout/ dashboard│
        │  quiz · tutor   │          └────────┬─────────┘
        └───────┬────────┘                   │
                │                    ┌────────▼─────────┐
        ┌───────▼────────┐           │  lib/             │
        │  Persistence    │          │  candleData       │
        │  localStorage   │◄────────►│  marketStructure  │
        │  IndexedDB      │          │  riskCalc         │
        └────────────────┘           │  aiTutor · db     │
                                     └───────────────────┘
                                              │
                                   data/ curriculum + modules
```

- **No backend.** All logic runs in the browser; data persists locally.
- **Deterministic data**: seeded RNG produces reproducible candles offline.
- **Service worker** (vite-plugin-pwa / Workbox) precaches the app shell for offline use.

---

## 🗃️ Data Model & "Database" Schema

State is split between **localStorage** (small, synchronous prefs/progress) and **IndexedDB** (larger, durable records).

### IndexedDB (`ict-academy` database)

| Object store | Key | Contents |
|--------------|-----|----------|
| `replaySessions` | `id` | Saved replay sessions (trades, revealed index) |
| `quizResults` | `id` (auto) + `moduleId` index | Every quiz/exam attempt |
| `tutorMessages` | `id` | AI tutor conversation history |
| `kv` | key | Generic key/value bag |

### localStorage keys

| Key | Shape |
|-----|-------|
| `ict-progress-v1` | `{ completedLessons, bestQuizScores, holderName }` |
| `ict-settings-v1` | `{ chartType, showVolume, showStructureLabels, animationsEnabled, accountCurrency }` |

All TypeScript interfaces live in [`src/types/index.ts`](src/types/index.ts).


---

## 📁 Folder Architecture

```
src/
├── components/
│   ├── chart/         # CandleChart (lightweight-charts) + AnimatedChart
│   ├── dashboard/     # SkillRadar (SVG)
│   ├── layout/        # Layout, Sidebar
│   ├── lesson/        # LessonContent renderer
│   ├── quiz/          # QuizEngine (runner + result)
│   └── ui/            # Card, Badge, ProgressBar, StatCard, Callout…
├── data/
│   ├── modules/       # 8 curriculum modules (lessons + examples + quizzes)
│   ├── curriculum.ts  # aggregation + helpers (getModule, moduleQuiz, levelMeta)
│   └── finalExam.ts   # certification exam
├── lib/
│   ├── candleData.ts      # seeded OHLC generator, patterns, replay datasets
│   ├── marketStructure.ts # swing detection + HH/HL/LH/LL labelling
│   ├── riskCalc.ts        # position sizing, R:R, expectancy, envelope
│   ├── aiTutor.ts         # offline knowledge base + keyword engine
│   ├── db.ts              # IndexedDB wrapper
│   ├── storage.ts         # localStorage helpers
│   └── utils.ts           # cn, uid, seededRandom, formatters
├── pages/             # one component per route
├── store/             # 5 Zustand stores
├── types/             # all interfaces & types
├── router.tsx
├── main.tsx
└── index.css
```

---

## ⚙️ Core Engines

### Chart engine — `components/chart/CandleChart.tsx`
Wraps **Lightweight Charts v4**. Supports candlestick/bar/line series, a volume histogram, series markers (HH/HL/LH/LL, entry/SL/TP, sweeps, BOS/CHoCH), price lines, and an HTML overlay layer that renders rectangular **zones** (order blocks, FVGs, premium/discount) using `timeToCoordinate` / `priceToCoordinate`. `AnimatedChart` reveals candles progressively to visualise pattern formation.

### Replay engine — `store/useReplayStore.ts`
Loads a dataset, reveals candles via `next/back/jump`, lets you open trades, then `evaluateTrades()` walks forward candle-by-candle to resolve SL/TP hits and compute R-multiples and aggregate stats. Sessions persist to IndexedDB.

### Quiz engine — `store/useQuizStore.ts` + `components/quiz/QuizEngine.tsx`
Generic engine for single/multiple/true-false/chart-identify (and drag-match scoring). Computes score, stores attempts in IndexedDB, and feeds best scores into progress + certification.

### Progress engine — `store/useProgressStore.ts`
Tracks completed lessons and best quiz scores; the dashboard derives a per-module **mastery** (60% lessons + 40% quiz) and renders a skill radar plus strengths/weaknesses.

### Offline AI Tutor — `lib/aiTutor.ts`
A curated ICT knowledge base scored by keyword overlap. Deterministic, instant, no network.


---

## 🧰 Tech Stack

| Concern | Choice |
|---------|--------|
| Framework | React 18 + TypeScript |
| Styling | Tailwind CSS (dark trading theme) |
| State | Zustand |
| Charts | TradingView Lightweight Charts |
| Storage | IndexedDB + localStorage |
| Build | Vite 5 |
| Offline / installable | vite-plugin-pwa (Workbox) |
| Routing | React Router 6 |

---

## 🚀 Getting Started

Requirements: **Node.js 18+**.

```bash
# install dependencies
npm install

# start the dev server
npm run dev

# type-check + production build
npm run build

# preview the production build (test offline/PWA)
npm run preview
```

The app runs at `http://localhost:5173` (dev) / `http://localhost:4173` (preview).

### Installing as a PWA
Open the production preview in Chrome/Edge → use the **Install** icon in the address bar, or "Add to Home Screen" on mobile. Once cached, it works with no internet connection.

> Note: the service worker is only active in the production build (`npm run build` + `npm run preview`), not in `npm run dev`.

---

## 📦 Deployment Guide

This is a fully static site — host the `dist/` folder anywhere.

**Any static host (Netlify / Vercel / GitHub Pages / S3 / Nginx):**
```bash
npm run build      # outputs to dist/
```
Upload `dist/`. Because the app uses client-side routing, configure a **SPA fallback** so all routes serve `index.html`:

- **Netlify** — add `_redirects` with: `/*  /index.html  200`
- **Vercel** — framework preset "Vite" handles it automatically.
- **Nginx** — `try_files $uri $uri/ /index.html;`
- **GitHub Pages** — copy `index.html` to `404.html` after build.

No environment variables, secrets or servers are required.

---

## 🎨 UI / UX

- **Dark, TradingView-style** interface. Desktop-first, responsive down to mobile (collapsible drawer).
- Palette: Bullish `#26a69a`, Bearish `#ef5350`, Background `#0e1117`, Accent `#2962ff`, Gold `#f5b041`.

---

## 📜 License

MIT — for educational use. Trading involves risk; this project is **not** financial advice.
