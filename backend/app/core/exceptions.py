from typing import Optional, Any

class AirwiseException(Exception):
    def __init__(self, code: str, message: str, status_code: int = 400, details: Optional[Any] = None):
        self.code = code
        self.message = message
        self.status_code = status_code
        self.details = details
        super().__init__(message)

class DataProviderUnavailableException(AirwiseException):
    def __init__(self, message: str = "Environmental data provider is temporarily unavailable", provider: Optional[str] = None):
        super().__init__(
            code="DATA_PROVIDER_UNAVAILABLE",
            message=message,
            status_code=503,
            details={"provider": provider} if provider else None
        )

class InvalidStandardException(AirwiseException):
    def __init__(self, message: str = "Incompatible or invalid AQI standard specified"):
        super().__init__(
            code="INVALID_AQI_STANDARD",
            message=message,
            status_code=422
        )

class ResourceNotFoundException(AirwiseException):
    def __init__(self, message: str = "Requested resource not found"):
        super().__init__(
            code="RESOURCE_NOT_FOUND",
            message=message,
            status_code=404
        )

class RateLimitExceededException(AirwiseException):
    def __init__(self, message: str = "Rate limit exceeded. Please throttle requests."):
        super().__init__(
            code="RATE_LIMIT_EXCEEDED",
            message=message,
            status_code=429
        )
