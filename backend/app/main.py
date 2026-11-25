from pathlib import Path
from fastapi import FastAPI, Request
from fastapi.responses import JSONResponse, FileResponse
from fastapi.staticfiles import StaticFiles
from fastapi.middleware.cors import CORSMiddleware
from fastapi.middleware.gzip import GZipMiddleware
from backend.app.config import settings
from backend.app.core.exceptions import AirwiseException
from backend.app.core.logging import logger
from backend.app.db.database import engine, Base
from backend.app.schemas.common import ApiResponse, ResponseMetadata

# Import all models to ensure registration with Base metadata
import backend.app.models.user
import backend.app.models.profile
import backend.app.models.routine
import backend.app.models.air_quality
import backend.app.models.recommendation
import backend.app.models.action
import backend.app.models.scenario
import backend.app.models.community
import backend.app.models.notification

# Import all API routers
from backend.app.api.routes import (
    health,
    air_quality,
    profile,
    routine,
    daily_plan,
    recommendations,
    scenarios,
    indoor_air,
    community,
    notifications,
    ai
)

# Initialize database schema
Base.metadata.create_all(bind=engine)

app = FastAPI(
    title="AIRWISE Climate Intelligence API",
    description="Production-grade AI adaptation system translating environmental telemetry into personalized daily decisions.",
    version="1.0.0-competition",
    docs_url="/docs",
    redoc_url="/redoc"
)

# Compression Middleware for efficient JSON telemetry delivery
app.add_middleware(GZipMiddleware, minimum_size=500)

# CORS Middleware using explicit configured origins
app.add_middleware(
    CORSMiddleware,
    allow_origins=settings.cors_origins,
    allow_credentials=True,
    allow_methods=["GET", "POST", "PUT", "PATCH", "DELETE", "OPTIONS"],
    allow_headers=["Content-Type", "Authorization"],
)


# Security Headers Middleware
@app.middleware("http")
async def add_security_headers(request: Request, call_next):
    response = await call_next(request)
    response.headers["X-Content-Type-Options"] = "nosniff"
    response.headers["X-Frame-Options"] = "DENY"
    response.headers["Referrer-Policy"] = "strict-origin-when-cross-origin"
    response.headers["Permissions-Policy"] = "geolocation=(), microphone=(), camera=()"
    return response

# Custom Exception Handler ensuring strictly unified API response format
@app.exception_handler(AirwiseException)
async def airwise_exception_handler(request: Request, exc: AirwiseException):
    logger.warning(f"Handled AirwiseException: {exc.code} - {exc.message}")
    payload = ApiResponse.fail(
        code=exc.code,
        message=exc.message,
        details=exc.details,
        metadata=ResponseMetadata(
            source="AIRWISE Exception Filter",
            freshness="unavailable"
        )
    )
    return JSONResponse(status_code=exc.status_code, content=payload.model_dump())

@app.exception_handler(Exception)
async def generic_exception_handler(request: Request, exc: Exception):
    logger.error(f"Unhandled Exception on {request.url.path}: {str(exc)}", exc_info=True)
    payload = ApiResponse.fail(
        code="INTERNAL_SERVER_ERROR",
        message="An unexpected environmental calculation error occurred. Deterministic safety fallback engaged.",
        details=str(exc) if settings.DEBUG else None
    )
    return JSONResponse(status_code=500, content=payload.model_dump())

# Register API routers
app.include_router(health.router, prefix=settings.API_V1_STR)
app.include_router(air_quality.router, prefix=settings.API_V1_STR)
app.include_router(profile.router, prefix=settings.API_V1_STR)
app.include_router(routine.router, prefix=settings.API_V1_STR)
app.include_router(daily_plan.router, prefix=settings.API_V1_STR)
app.include_router(recommendations.router, prefix=settings.API_V1_STR)
app.include_router(scenarios.router, prefix=settings.API_V1_STR)
app.include_router(indoor_air.router, prefix=settings.API_V1_STR)
app.include_router(community.router, prefix=settings.API_V1_STR)
app.include_router(notifications.router, prefix=settings.API_V1_STR)
app.include_router(ai.router, prefix=settings.API_V1_STR)

DIST_DIR = Path(__file__).resolve().parents[2] / "dist"

if DIST_DIR.is_dir():
    assets_dir = DIST_DIR / "assets"
    if assets_dir.is_dir():
        app.mount("/assets", StaticFiles(directory=str(assets_dir)), name="assets")

    @app.get("/{full_path:path}")
    async def serve_spa(full_path: str):
        candidate = (DIST_DIR / full_path).resolve()
        if full_path and candidate.is_file() and candidate.is_relative_to(DIST_DIR.resolve()):
            return FileResponse(str(candidate))
        return FileResponse(str(DIST_DIR / "index.html"))
else:
    @app.get("/")
    async def root():
        return {
            "message": "Welcome to AIRWISE — Personal Air Intelligence API",
            "docs": "/docs",
            "health": "/api/health"
        }

if __name__ == "__main__":
    import uvicorn
    uvicorn.run("backend.app.main:app", host=settings.HOST, port=settings.PORT, reload=settings.DEBUG)
