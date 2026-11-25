# AIRWISE Backend & AI Intelligence Layer

## Personal Air Intelligence • Real Data • Decision Engine • Environmental Impact

AIRWISE transforms raw environmental telemetry into actionable everyday health decisions for commuting, indoor aeration, physical exercise, and community action.

---

## 1. Core Architecture

The backend is built with **FastAPI**, **Pydantic v2**, and **SQLAlchemy**, adhering strictly to clean architecture principles:

- **Provider Abstraction (`providers/`)**: Decouples air-quality, weather, and LLM telemetry. Supports live **Open-Meteo Air Quality & Copernicus CAMS models** with zero key requirements, alongside **Calibrated Station Simulator Mesh** for offline resilience.
- **Deterministic Recommendation Engine (`services/recommendation_engine.py`)**: Environmental thresholds and physiological exposure models are calculated deterministically via rules. The LLM does NOT invent AQI values, forecasts, or medical claims.
- **What-if Scenario Engine (`services/scenario_engine.py`)**: Simulates comparative decisions (transit mode, workout indoor vs outdoor, window aeration timing) with dynamic distance and wind dispersion sliders.
- **Impact Calculator (`services/impact_calculator.py`)**: Implements **IPCC 2021 Urban Mobility Benchmarks** (e.g. 0.015 kg CO2/passenger-km for electrified rail vs 0.055 kg/km for 125cc motorcycles). Strictly separates verified actions from estimated carbon savings; refuses to fabricate numbers when baseline data is missing.
- **Indoor Air Coach (`services/indoor_air_service.py`)**: Indoor combustion source audit (incense, cooking fumes, mosquito coils, dust resuspension) with an instant **Zero-Budget Mode** filtering exclusively to ₹0 interventions.
- **AI Intelligence Layer (`services/ai_service.py`)**: Pydantic-validated structured outputs with confidence scoring and non-negotiable medical disclaimers.

---

## 2. API Envelope Specification

All endpoints return a uniform JSON envelope:

```json
{
  "success": true,
  "data": { ... },
  "metadata": {
    "timestamp": "2026-11-21T08:30:00Z",
    "source": "Open-Meteo Copernicus CAMS Reanalysis",
    "freshness": "current",
    "mode": "live",
    "confidence_score": 95
  },
  "error": null
}
```

---

## 3. Quick Start & Local Development

### Prerequisites
- Python 3.10+
- Node.js 18+ (for frontend)

### Installation
```bash
# Navigate to backend and create virtual environment
cd backend
python -m venv venv

# Activate venv (Windows)
.\venv\Scripts\activate

# Install dependencies
pip install -r requirements.txt
```

### Running the API Server
```bash
# Start FastAPI with hot reload on port 8000
python -m uvicorn backend.app.main:app --host 127.0.0.1 --port 8000 --reload
```

Interactive OpenAPI Swagger UI is available at:
`http://127.0.0.1:8000/docs`

### Running the Test Suite
```bash
python -m pytest backend/tests -v
```

---

## 4. Key API Endpoints

| Method | Endpoint | Description |
|---|---|---|
| `GET` | `/api/health` | Health & uptime sentinel |
| `GET` | `/api/air/current` | Real-time / calibrated AQI & speciation (PM2.5, PM10, NO2, O3, CO, SO2) |
| `GET` | `/api/air/forecast` | Diurnal hourly and 5-day outlook |
| `GET` | `/api/air/location-comparison` | Comparative benchmarking across international metros |
| `GET` | `/api/plan/today` | 8-period chronological daily adaptation plan |
| `POST` | `/api/plan/generate` | Recalculate plan with WFH or zero-budget overrides |
| `POST` | `/api/scenarios/compare` | What-if simulation with distance & wind sliders |
| `GET` | `/api/indoor/recommendations` | Indoor air audit & zero-budget filtering |
| `POST` | `/api/ai/ask` | Contextual AI Copilot query with structured Pydantic response |
| `GET` | `/api/community` | Collective civic challenges & emission reductions |
