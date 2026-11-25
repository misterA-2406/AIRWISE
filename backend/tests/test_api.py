import pytest
from httpx import AsyncClient, ASGITransport
from backend.app.main import app

@pytest.mark.asyncio
async def test_health_endpoint():
    async with AsyncClient(transport=ASGITransport(app=app), base_url="http://test") as ac:
        response = await ac.get("/api/health")
        assert response.status_code == 200
        data = response.json()
        assert data["success"] is True
        assert data["data"]["status"] == "healthy"
        assert data["data"]["service"] == "AIRWISE Climate Intelligence API"

@pytest.mark.asyncio
async def test_current_air_endpoint():
    async with AsyncClient(transport=ASGITransport(app=app), base_url="http://test") as ac:
        response = await ac.get("/api/air/current?location_name=Delhi%20NCR")
        assert response.status_code == 200
        data = response.json()
        assert data["success"] is True
        assert data["data"]["aqi"] > 0
        assert data["data"]["risk_level"] in ("low", "moderate", "high", "severe")
        assert data["metadata"]["freshness"] == "current"

@pytest.mark.asyncio
async def test_daily_plan_endpoint():
    async with AsyncClient(transport=ASGITransport(app=app), base_url="http://test") as ac:
        response = await ac.get("/api/plan/today")
        assert response.status_code == 200
        data = response.json()
        assert data["success"] is True
        assert len(data["data"]["actions"]) == 8
        assert data["data"]["priority_decision"]["id"] is not None

@pytest.mark.asyncio
async def test_what_if_compare_endpoint():
    async with AsyncClient(transport=ASGITransport(app=app), base_url="http://test") as ac:
        payload = {"scenario_id": "sc-1", "distance_km": 14.0, "wind_condition_modifier": 1.0}
        response = await ac.post("/api/scenarios/compare", json=payload)
        assert response.status_code == 200
        data = response.json()
        assert data["success"] is True
        assert data["data"]["adjusted_reduction_percent"] == 73
        assert data["data"]["adjusted_emissions_delta_kg"] > 0

@pytest.mark.asyncio
async def test_indoor_recommendations_zero_budget():
    async with AsyncClient(transport=ASGITransport(app=app), base_url="http://test") as ac:
        response = await ac.get("/api/indoor/recommendations?zero_budget_only=true")
        assert response.status_code == 200
        data = response.json()
        assert data["success"] is True
        for rec in data["data"]["recommendations"]:
            assert rec["is_zero_budget_eligible"] is True
            assert rec["cost"] == "₹0 Free"

@pytest.mark.asyncio
async def test_ai_copilot_ask_endpoint():
    async with AsyncClient(transport=ASGITransport(app=app), base_url="http://test") as ac:
        payload = {
            "prompt": "Is it okay to exercise outdoors today?",
            "context": {
                "location": "Delhi NCR",
                "aqi": 284,
                "primary_pollutant": "pm25",
                "weather_condition": "Hazy",
                "has_vulnerable_members": True,
                "budget_mode": "zero-budget"
            }
        }
        response = await ac.post("/api/ai/ask", json=payload)
        assert response.status_code == 200
        data = response.json()
        assert data["success"] is True
        assert len(data["data"]["priority_actions"]) > 0
        assert "medical_disclaimer" in data["data"]
        assert data["data"]["actionable_card"] is not None
