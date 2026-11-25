import time
import hashlib
from typing import Dict, Tuple
from backend.app.schemas.ai import AIQueryRequest, AIStructuredResponse, AIContextPayload
from backend.app.providers.llm.mock_llm import DeterministicAIProvider
from backend.app.providers.llm.gemini_llm import GeminiAIProvider
from backend.app.config import settings
from backend.app.core.logging import logger


class AIService:
    """
    Orchestrates grounded GenAI intelligence with TTL caching and deterministic fallback.
    Uses Google Gemini when AI_API_KEY is configured; falls back cleanly to DeterministicAIProvider.
    """

    def __init__(self):
        self.mock_provider = DeterministicAIProvider()
        self.gemini_provider = GeminiAIProvider()
        self._cache: Dict[str, Tuple[float, AIStructuredResponse]] = {}

    def _cache_key(self, prompt: str, context: AIContextPayload) -> str:
        raw = f"{prompt.strip().lower()}|{context.location}|{context.aqi}|{context.commute_mode}|{context.budget_mode}"
        return hashlib.sha256(raw.encode("utf-8")).hexdigest()

    async def query_intelligence(self, request: AIQueryRequest) -> AIStructuredResponse:
        context = request.context or AIContextPayload(
            location="Delhi NCR",
            aqi=284,
            primary_pollutant="pm25",
            weather_condition="Haze",
            commute_mode="Metro",
            has_vulnerable_members=True,
            budget_mode="zero-budget"
        )

        key = self._cache_key(request.prompt, context)
        now = time.monotonic()
        cached = self._cache.get(key)
        if cached and (now - cached[0]) < settings.CACHE_TTL_AI_SECONDS:
            return cached[1]

        response: AIStructuredResponse | None = None
        if settings.AI_PROVIDER.lower() == "gemini" and settings.AI_API_KEY.strip():
            try:
                self.gemini_provider.api_key = settings.AI_API_KEY.strip()
                response = await self.gemini_provider.generate_structured_response(request.prompt, context)
            except Exception as exc:
                logger.warning(f"Gemini provider unavailable ({type(exc).__name__}); engaging deterministic fallback.")

        if response is None:
            response = await self.mock_provider.generate_structured_response(request.prompt, context)

        self._cache[key] = (now, response)
        return response


ai_service = AIService()
