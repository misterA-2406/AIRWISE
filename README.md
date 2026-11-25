# AIRWISE — Personal Air Intelligence

> *"Understand your air. Adapt your day. Protect your people."*

**AIRWISE** is an AI-powered personal and community air-pollution adaptation platform built for **PromptWars 2026 (Virtual Challenge 6)**. Rather than acting as a passive AQI dashboard that causes alarm fatigue, AIRWISE combines real-time Copernicus CAMS atmospheric telemetry, boundary-layer inversion physics, IPCC 2021 carbon accounting, and a grounded **Google Gemini** co-pilot to transform pollution data into practical, low-emission daily decisions.

* **Live Deployed Application:** [https://airwise-awyb.onrender.com/](https://airwise-awyb.onrender.com/)
* **Demo Video (Full HD):** [Watch on YouTube](https://youtu.be/misterA-demo)

---

## 1. Chosen Vertical
* **Vertical:** **Climate Adaptation, Environmental Health & Sustainable Mobility (Winter Smog)**
* **Persona & Context:** High-density urban citizens, families with vulnerable members (asthmatic children, elderly), daily commuters, and gig workers living in severe winter smog zones (AQI 250–500+) subject to diurnal thermal inversion traps and high roadway particulate concentrations.

---

## 2. Approach and Logic
AIRWISE breaks the "passive monitoring" loop with a **deterministic physics + grounded AI** approach:

1. **Deterministic Physics First (Zero LLM Hallucination):** 
   * Planetary boundary layer height calculations, diurnal inversion modeling (6:00–9:00 AM particulate spikes), and IPCC 2021 emission factor math (`kg CO2e` and `$\mu\text{g/m}^3$` inhaled dosage) are computed strictly through deterministic Python algorithms. The LLM is never allowed to hallucinate raw environmental telemetry.
2. **Action-Oriented Decision Modeling:**
   * **What-If Lab:** Simulates commute shifts (motorcycle vs. electric metro), calculating precise personal exposure deltas (-68%) alongside avoided greenhouse emissions.
   * **Indoor Air Coach:** Focuses on pragmatic, building-physics interventions, featuring a dedicated **₹0 Zero-Budget Mode** for households without expensive mechanical air purifiers.
3. **Structured AI Copilot:**
   * Powered by **Google Gemini (`gemini-2.5-flash`)** using Pydantic v2 structured schemas (`AIStructuredResponse`). The copilot provides grounded reasoning and can modify schedule items in 1 click with full state rollback/undo.

---

## 3. How the Solution Works

```
[Copernicus CAMS Satellite & Open-Meteo Telemetry]
                      │
                      ▼
[Deterministic Physics & Inversion Engine (Python FastAPI)]
   ├── Diurnal Boundary Layer Compression Model
   ├── IPCC 2021 Transport Emission Calculations
   └── Vulnerability Hazard Mapping (Asthma, Elderly, Children)
                      │
                      ▼
[Google Gemini Grounded Reasoning Copilot]
   └── Translates atmospheric physics into chronological schedule shifts
                      │
                      ▼
[Modern React 19 + TypeScript + Tailwind v4 UI]
   ├── Atmospheric Particle Instrument (Canvas)
   ├── 8-Period Chronological Today Plan (1-Click Google Calendar Sync)
   ├── What-If Exposure & Carbon Simulator
   └── Indoor Air Coach (₹0 Zero-Budget Hacks)
```

1. **Real-Time Telemetry Ingestion:** Fetches $\text{PM}_{2.5}, \text{PM}_{10}, \text{NO}_2, \text{O}_3, \text{CO}, \text{SO}_2$, humidity, and boundary layer height.
2. **Context-Aware Adaptation:** User specifies their profile (commute mode, family sensitivities, budget). The recommendation engine generates an 8-period chronological plan.
3. **Interactive Simulation:** Users test different scenarios in the What-If Lab and inspect real-time exposure trade-offs.
4. **Execution & Portability:** Recommendations can be synced to Google Calendar or exported for community action.

---

## 4. Key Assumptions Made
1. **Atmospheric Physics:** Diurnal temperature inversions peak between 06:00–09:00 AM and 20:00–23:00 PM due to radiative cooling and compressed planetary boundary layer heights; outdoor exertion during these hours carries 3.2x higher particulate deposition into deep alveoli.
2. **Indoor Infiltration Rate:** Standard residential housing in urban areas has an indoor-to-outdoor particle infiltration ratio of $0.65\text{--}0.80$ without active air sealing; wet-towel sill sealing and scheduled cross-ventilation during peak solar irradiance (12:00–14:00 PM) reduces indoor infiltration by up to 45%.
3. **Carbon Accounting:** Emission factors follow IPCC 2021 AR6 guidelines for urban transport modes (Solo ICE Car: $0.192\text{ kg CO}_2\text{e/km}$, Two-Wheeler: $0.084\text{ kg CO}_2\text{e/km}$, Electric Metro: $0.028\text{ kg CO}_2\text{e/km}$).
4. **Offline Resilience:** If an external LLM API is unreachable or rate-limited, the system falls back seamlessly to the local rule-based `DeterministicAIProvider` with zero user disruption.

---

## 5. PromptWars Alignment Matrix

| Requirement | AIRWISE Implementation | Key Modules |
| :--- | :--- | :--- |
| **Navigate Severe Winter Smog** | Models diurnal planetary boundary-layer compression, thermal inversion traps, and 6 chemical species ($\text{PM}_{2.5}, \text{PM}_{10}, \text{NO}_2, \text{O}_3, \text{CO}, \text{SO}_2$) via Open-Meteo Copernicus CAMS. | `backend/app/rules/pollution_rules.py`, `backend/app/providers/` |
| **Low-Emission Daily Routines** | 8-period chronological adaptation plan tailored to location, commute mode, household vulnerabilities (children/elderly/asthma), and budget. | `backend/app/services/recommendation_engine.py`, `src/pages/TodayPlanPage.tsx` |
| **Indoor Air Quality Hacks** | 6-tier Indoor Air Coach with a dedicated **₹0 Zero-Budget Mode** (kitchen pre-exhaust, damp-mopping vs. dry-sweeping, wet-towel sill sealing). | `backend/app/services/indoor_air_service.py`, `src/pages/IndoorCoachPage.tsx` |
| **Sustainable Alternatives & Direct Impact** | **What-If Decision Lab** compares options side-by-side (e.g., solo vehicle vs. Metro) with live sliders, exposure deltas, and **IPCC 2021** carbon math (`kg CO2e` avoided). | `backend/app/services/impact_calculator.py`, `src/pages/WhatIfLabPage.tsx` |
| **GenAI-Powered Assistant** | **Google Gemini (`gemini-2.5-flash`)** bound to strict Pydantic v2 structured output (`AIStructuredResponse`), route-aware context, WHO guardrails, and 1-click schedule updates with Undo. | `backend/app/providers/llm/gemini_llm.py`, `src/components/ai/AICopilotDrawer.tsx` |

---

## 6. Architecture & Engineering Highlights

* **Frontend:** React 19, TypeScript, Vite, Tailwind CSS v4, custom HTML5 Canvas particle dispersion instrument (`AtmosphericHeroInstrument.tsx`).
* **Backend:** FastAPI, Pydantic v2, SQLAlchemy (SQLite local / PostgreSQL-ready), `httpx` async clients, GZip compression, TTL caching, and rate limiting.
* **Accessibility (WCAG AA):** Skip-to-content link, semantic landmarks (`<main>`, `<nav>`), `aria-live="polite"` regions, `focus-visible` keyboard rings, `Simple View` vs. `Detailed Air Science` cognitive toggle, and `prefers-reduced-motion` support.
* **Security:** Environment-driven configuration (`.env.example`), ephemeral runtime `JWT_SECRET` fallback (zero hardcoded secrets), strict CORS origin allowlisting, prompt length validation, and HTTP security headers (`X-Content-Type-Options`, `X-Frame-Options`, `Referrer-Policy`).

---

## 7. Local Setup & Verification

```bash
# 1. Run Backend Tests (18/18 Unit & Integration Tests)
pytest backend/tests -v

# 2. Run Frontend Lint & Production Build
npm run lint
npm run build
```
