import json
import httpx
from backend.app.providers.llm.base import BaseLLMProvider
from backend.app.schemas.ai import AIContextPayload, AIStructuredResponse
from backend.app.config import settings


class GeminiAIProvider(BaseLLMProvider):
    """
    Google Gemini API provider using structured JSON output.
    Strictly grounded in verified telemetry and deterministic rules passed in context.
    """

    name: str = "GoogleGemini"
    BASE_URL: str = "https://generativelanguage.googleapis.com/v1beta/models"

    SYSTEM_INSTRUCTION: str = (
        "You are AIRWISE Copilot, a scientifically grounded climate-health adaptation assistant. "
        "CRITICAL GROUNDING RULES: "
        "1. NEVER invent or alter AQI numbers, pollutant concentrations, or IPCC emission factors. "
        "Use ONLY the numbers provided in the verified context. "
        "2. Prioritize practical, low-cost or zero-budget adaptations tailored to the user's location, "
        "commute mode, and household vulnerabilities. "
        "3. State uncertainties transparently and never make diagnostic medical claims."
    )

    RESPONSE_SCHEMA: dict = {
        "type": "OBJECT",
        "properties": {
            "summary": {"type": "STRING"},
            "risk_context": {"type": "STRING"},
            "priority_actions": {"type": "ARRAY", "items": {"type": "STRING"}},
            "alternatives": {"type": "ARRAY", "items": {"type": "STRING"}},
            "tradeoffs": {"type": "ARRAY", "items": {"type": "STRING"}},
            "explanation": {"type": "STRING"},
            "uncertainties": {"type": "ARRAY", "items": {"type": "STRING"}},
            "sources": {"type": "ARRAY", "items": {"type": "STRING"}},
            "actionable_card": {
                "type": "OBJECT",
                "nullable": True,
                "properties": {
                    "title": {"type": "STRING"},
                    "category": {"type": "STRING"},
                    "action_text": {"type": "STRING"},
                    "reduction_impact": {"type": "STRING"},
                },
                "required": ["title", "category", "action_text", "reduction_impact"],
            },
            "confidence_score": {"type": "INTEGER"},
        },
        "required": [
            "summary",
            "risk_context",
            "priority_actions",
            "alternatives",
            "tradeoffs",
            "explanation",
            "uncertainties",
            "sources",
            "confidence_score",
        ],
    }

    def __init__(self, api_key: str | None = None, model: str | None = None, timeout: float | None = None):
        self.api_key = api_key if api_key is not None else settings.AI_API_KEY
        self.model = model or settings.AI_MODEL
        self.timeout = timeout or settings.AI_TIMEOUT_SECONDS

    async def generate_structured_response(self, prompt: str, context: AIContextPayload) -> AIStructuredResponse:
        if not self.api_key:
            raise ValueError("Gemini AI_API_KEY is not configured.")

        url = f"{self.BASE_URL}/{self.model}:generateContent"
        user_payload = (
            f"Verified Environmental & Lifestyle Context:\n"
            f"- Location: {context.location}\n"
            f"- Live AQI: {context.aqi} ({context.standard})\n"
            f"- Primary Pollutant: {context.primary_pollutant}\n"
            f"- Weather Condition: {context.weather_condition}\n"
            f"- Commute Mode: {context.commute_mode}\n"
            f"- Vulnerable Household Members: {context.has_vulnerable_members}\n"
            f"- Budget Mode: {context.budget_mode}\n"
            f"- Rule Engine Actions: {context.rule_generated_actions}\n\n"
            f"User Question: {prompt.strip()}"
        )

        body = {
            "systemInstruction": {"parts": [{"text": self.SYSTEM_INSTRUCTION}]},
            "contents": [{"role": "user", "parts": [{"text": user_payload}]}],
            "generationConfig": {
                "temperature": 0.2,
                "maxOutputTokens": 1024,
                "responseMimeType": "application/json",
                "responseSchema": self.RESPONSE_SCHEMA,
            },
        }

        async with httpx.AsyncClient(timeout=self.timeout) as client:
            resp = await client.post(
                url,
                headers={
                    "Content-Type": "application/json",
                    "x-goog-api-key": self.api_key,
                },
                json=body,
            )
            resp.raise_for_status()
            data = resp.json()

        candidates = data.get("candidates") or []
        if not candidates:
            raise ValueError("Gemini API returned no candidates.")

        parts = candidates[0].get("content", {}).get("parts", [])
        raw_text = "".join(p.get("text", "") for p in parts).strip()
        if not raw_text:
            raise ValueError("Gemini API returned empty content.")

        parsed = json.loads(raw_text)
        return AIStructuredResponse.model_validate(parsed)
