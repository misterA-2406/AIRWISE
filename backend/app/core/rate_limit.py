import time
from collections import defaultdict
from fastapi import Request
from backend.app.core.exceptions import RateLimitExceededException
from backend.app.config import settings

class InMemoryRateLimiter:
    def __init__(self, requests_per_minute: int = 60):
        self.rpm = requests_per_minute
        self.requests = defaultdict(list)

    def check(self, client_ip: str):
        now = time.time()
        window_start = now - 60.0
        
        # Clean older requests
        self.requests[client_ip] = [ts for ts in self.requests[client_ip] if ts > window_start]
        
        if len(self.requests[client_ip]) >= self.rpm:
            raise RateLimitExceededException()
            
        self.requests[client_ip].append(now)

rate_limiter = InMemoryRateLimiter(settings.RATE_LIMIT_PER_MINUTE)

async def check_rate_limit(request: Request):
    client_ip = request.client.host if request.client else "127.0.0.1"
    rate_limiter.check(client_ip)
