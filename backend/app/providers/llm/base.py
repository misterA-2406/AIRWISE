from abc import ABC, abstractmethod
from backend.app.schemas.ai import AIContextPayload, AIStructuredResponse

class BaseLLMProvider(ABC):
    name: str = "BaseLLM"

    @abstractmethod
    async def generate_structured_response(self, prompt: str, context: AIContextPayload) -> AIStructuredResponse:
        pass
