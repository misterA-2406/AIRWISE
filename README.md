# AIRWISE — Personal Air Intelligence

> *"Understand your air. Adapt your day. Protect your people."*

**AIRWISE** is an AI-powered personal and community air-pollution adaptation platform built for **PromptWars 2026 (Virtual Challenge 6)**. Rather than acting as a passive AQI dashboard that causes alarm fatigue, AIRWISE combines real-time Copernicus CAMS atmospheric telemetry, boundary-layer inversion physics, IPCC 2021 carbon accounting, and a grounded **Google Gemini** co-pilot to transform pollution data into practical, low-emission daily decisions.

---

## PromptWars Alignment Matrix

| Requirement | AIRWISE Implementation | Key Modules |
| :--- | :--- | :--- |
| **Navigate Severe Winter Smog** | Models diurnal planetary boundary-layer compression, thermal inversion traps, and 6 chemical species ($\text{PM}_{2.5}, \text{PM}_{10}, \text{NO}_2, \text{O}_3, \text{CO}, \text{SO}_2$) via Open-Meteo Copernicus CAMS. | `backend/app/rules/pollution_rules.py`, `backend/app/providers/` |
| **Low-Emission Daily Routines** | 8-period chronological adaptation plan tailored to location, commute mode, household vulnerabilities (children/elderly/asthma), and budget. | `backend/app/services/recommendation_engine.py`, `src/pages/TodayPlanPage.tsx` |
| **Indoor Air Quality Hacks** | 6-tier Indoor Air Coach with a dedicated **₹0 Zero-Budget Mode** (kitchen pre-exhaust, damp-mopping vs. dry-sweeping, wet-towel sill sealing). | `backend/app/services/indoor_air_service.py`, `src/pages/IndoorCoachPage.tsx` |
| **Sustainable Alternatives & Direct Impact** | **What-If Decision Lab** compares options side-by-side (e.g., solo vehicle vs. Metro) with live sliders, exposure deltas, and **IPCC 2021** carbon math (`kg CO2e` avoided). | `backend/app/services/impact_calculator.py`, `src/pages/WhatIfLabPage.tsx` |
| **GenAI-Powered Assistant** | **Google Gemini (`gemini-2.5-flash`)** bound to strict Pydantic v2 structured output (`AIStructuredResponse`), route-aware context, WHO guardrails, and 1-click schedule updates with Undo. | `backend/app/providers/llm/gemini_llm.py`, `src/components/ai/AICopilotDrawer.tsx` |

---

## Architecture & Engineering Highlights

* **Frontend:** React 19, TypeScript, Vite, Tailwind CSS v4, custom HTML5 Canvas particle dispersion instrument (`AtmosphericHeroInstrument.tsx`).
* **Backend:** FastAPI, Pydantic v2, SQLAlchemy (SQLite local / PostgreSQL-ready), `httpx` async clients, GZip compression, TTL caching, and rate limiting.
* **Scientific Grounding (Zero LLM Hallucination):** The LLM never invents AQI numbers or emission factors. All environmental math runs deterministically in Python; Gemini translates verified context into actionable family guidance and falls back gracefully to `DeterministicAIProvider` offline.
* **Accessibility (WCAG AA):** Skip-to-content link, semantic landmarks (`<main>`, `<nav>`), `aria-live="polite"` regions, `focus-visible` keyboard rings, `Simple View` vs. `Detailed Air Science` cognitive toggle, and `prefers-reduced-motion` support.
* **Security:** Environment-driven configuration (`.env.example`), ephemeral runtime `JWT_SECRET` fallback (zero hardcoded secrets), strict CORS origin allowlisting, prompt length validation, and HTTP security headers (`X-Content-Type-Options`, `X-Frame-Options`, `Referrer-Policy`).

---

## Local Setup

### 1. Backend (FastAPI)
```bash
cp .env.example .env
# Optional: Add your free Gemini API key to .env -> AI_API_KEY=...
python -m venv backend/venv
# Windows: backend\venv\Scripts\activate | macOS/Linux: source backend/venv/bin/activate
pip install -r backend/requirements.txt
uvicorn backend.app.main:app --host 127.0.0.1 --port 8000 --reload
```

### 2. Frontend (React + Vite)
```bash
npm install
npm run dev
```

### 3. Run Tests & Verification
```bash
# Backend unit & integration tests
pytest backend/tests -v

# Frontend lint & production build
npm run lint
npm run build
```

---

## Cloud Deployment Guide
* **Frontend (Vercel / Netlify):** Connect your public GitHub repo, build command `npm run build`, output directory `dist`. Set `VITE_API_BASE_URL` to your deployed backend URL.
* **Backend (Render / Railway):** Start command `uvicorn backend.app.main:app --host 0.0.0.0 --port $PORT`. Set `AI_PROVIDER=gemini`, `AI_API_KEY=<your-free-gemini-key>`, and `FRONTEND_ORIGIN=https://<your-vercel-domain>`.
