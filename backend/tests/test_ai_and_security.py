import json
import pytest
from unittest.mock import AsyncMock, patch, MagicMock
from fastapi.testclient import TestClient
from backend.app.main import app
from backend.app.config import settings
from backend.app.providers.llm.gemini_llm import GeminiAIProvider
from backend.app.schemas.ai import AIContextPayload, AIQueryRequest
from backend.app.services.ai_service import AIService

client = TestClient(app)


def test_security_headers_present():
    res = client.get("/api/health")
    assert res.status_code == 200
    assert res.headers.get("X-Content-Type-Options") == "nosniff"
    assert res.headers.get("X-Frame-Options") == "DENY"
    assert res.headers.get("Referrer-Policy") == "strict-origin-when-cross-origin"
    assert "default-src" in res.headers.get("Content-Security-Policy", "")
    assert "max-age=" in res.headers.get("Strict-Transport-Security", "")


def test_jwt_secret_not_hardcoded_literal():
    assert settings.JWT_SECRET != "super-secret-climate-key-change-in-production"
    assert len(settings.JWT_SECRET) >= 32


def test_ai_prompt_validation_rejects_empty_or_oversized():
    empty_res = client.post("/api/ai/ask", json={"prompt": ""})
    assert empty_res.status_code == 422

    huge_res = client.post("/api/ai/ask", json={"prompt": "x" * 1005})
    assert huge_res.status_code == 422


@pytest.mark.asyncio
async def test_gemini_provider_structured_output_parsing():
    mock_payload = {
        "candidates": [
            {
                "content": {
                    "parts": [
                        {
                            "text": json.dumps({
                                "summary": "Take the Metro instead of motorbike today.",
                                "risk_context": "Delhi NCR AQI is 284 with morning inversion.",
                                "priority_actions": ["Use underground Metro", "Wear N95 outdoors"],
                                "alternatives": ["Work from home"],
                                "tradeoffs": ["+10 mins travel time"],
                                "explanation": "Positive-pressure Metro cabins cut PM2.5 inhalation by ~68%.",
                                "uncertainties": ["Street-level traffic variance"],
                                "sources": ["Copernicus CAMS", "WHO 2021 Guidelines"],
                                "actionable_card": {
                                    "title": "Switch to Metro",
                                    "category": "commute",
                                    "action_text": "Use Metro Line",
                                    "reduction_impact": "-68% exposure"
                                },
                                "confidence_score": 92
                            })
                        }
                    ]
                }
            }
        ]
    }

    mock_response = MagicMock()
    mock_response.raise_for_status = MagicMock()
    mock_response.json = MagicMock(return_value=mock_payload)

    with patch("httpx.AsyncClient.post", new=AsyncMock(return_value=mock_response)):
        provider = GeminiAIProvider(api_key="test-key-123")
        ctx = AIContextPayload(
            location="Delhi NCR",
            aqi=284,
            primary_pollutant="pm25",
            weather_condition="Haze",
        )
        result = await provider.generate_structured_response("Should I take metro?", ctx)
        assert result.summary == "Take the Metro instead of motorbike today."
        assert result.confidence_score == 92
        assert result.actionable_card is not None
        assert result.actionable_card.category == "commute"


@pytest.mark.asyncio
async def test_ai_service_falls_back_gracefully_on_gemini_error():
    service = AIService()
    with patch.object(settings, "AI_PROVIDER", "gemini"), \
         patch.object(settings, "AI_API_KEY", "fake-key"), \
         patch.object(service.gemini_provider, "generate_structured_response", side_effect=RuntimeError("API down")):
        req = AIQueryRequest(prompt="Why avoid morning jogging?")
        res = await service.query_intelligence(req)
        assert res.summary
        assert res.confidence_score > 0
