from typing import Generic, TypeVar, Optional, Any, Dict
from datetime import datetime, timezone
from pydantic import BaseModel, Field

T = TypeVar("T")

class ResponseMetadata(BaseModel):
    timestamp: str = Field(default_factory=lambda: datetime.now(timezone.utc).isoformat())
    source: str = "AIRWISE Climate Intelligence Engine"
    freshness: str = "current"  # current, recently_updated, stale, unavailable, demo
    mode: str = "live"          # live, demo, simulated
    confidence_score: Optional[int] = 94
    provider: Optional[str] = None

class ErrorDetail(BaseModel):
    code: str
    message: str
    details: Optional[Any] = None

class ApiResponse(BaseModel, Generic[T]):
    success: bool = True
    data: Optional[T] = None
    metadata: ResponseMetadata = Field(default_factory=ResponseMetadata)
    error: Optional[ErrorDetail] = None

    @classmethod
    def ok(cls, data: T, metadata: Optional[ResponseMetadata] = None) -> "ApiResponse[T]":
        return cls(
            success=True,
            data=data,
            metadata=metadata or ResponseMetadata(),
            error=None
        )

    @classmethod
    def fail(cls, code: str, message: str, details: Optional[Any] = None, metadata: Optional[ResponseMetadata] = None) -> "ApiResponse[T]":
        return cls(
            success=False,
            data=None,
            metadata=metadata or ResponseMetadata(freshness="unavailable"),
            error=ErrorDetail(code=code, message=message, details=details)
        )
