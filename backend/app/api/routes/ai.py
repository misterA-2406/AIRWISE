from fastapi import APIRouter, Depends
from backend.app.schemas.common import ApiResponse, ResponseMetadata
from backend.app.schemas.ai import AIQueryRequest, AIStructuredResponse
from backend.app.services.ai_service import ai_service
from backend.app.core.rate_limit import check_rate_limit

router = APIRouter(prefix="/ai", tags=["AI Intelligence"], dependencies=[Depends(check_rate_limit)])

@router.post("/ask", response_model=ApiResponse[AIStructuredResponse])
async def ask_copilot(request: AIQueryRequest):
    response = await ai_service.query_intelligence(request)
    return ApiResponse.ok(
        data=response,
        metadata=ResponseMetadata(
            source="AIRWISE AI Contextual Synthesis Engine",
            freshness="current",
            confidence_score=response.confidence_score
        )
    )

@router.post("/plan", response_model=ApiResponse[AIStructuredResponse])
async def plan_copilot(request: AIQueryRequest):
    response = await ai_service.query_intelligence(request)
    return ApiResponse.ok(data=response)

@router.post("/explain", response_model=ApiResponse[AIStructuredResponse])
async def explain_copilot(request: AIQueryRequest):
    response = await ai_service.query_intelligence(request)
    return ApiResponse.ok(data=response)
