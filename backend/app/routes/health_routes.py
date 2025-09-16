"""
Rotas para health check e status da aplicação
"""
from fastapi import APIRouter
from fastapi.responses import JSONResponse

from app.config import settings
from app.services.gemini_service import gemini_service, GEMINI_AVAILABLE
from app.utils.pdf_extractor import get_available_pdf_libraries

router = APIRouter(tags=["health"])


@router.get("/")
async def health_check():
    """
    Endpoint de health check
    
    Returns:
        JSONResponse: Status da aplicação e serviços disponíveis
    """
    return JSONResponse(
        status_code=200,
        content={
            "status": "ok",
            "app": settings.APP_TITLE,
            "version": settings.APP_VERSION,
            "services": {
                "gemini_sdk": GEMINI_AVAILABLE,
                "gemini_configured": settings.has_gemini_key,
                "pdf_libraries": get_available_pdf_libraries()
            }
        }
    )


@router.get("/health")
async def detailed_health():
    """
    Endpoint de health check detalhado
    
    Returns:
        JSONResponse: Status detalhado dos serviços
    """
    gemini_status = "ok" if gemini_service.is_available() else "unavailable"
    pdf_libs = get_available_pdf_libraries()
    pdf_status = "ok" if pdf_libs else "no_libraries"
    
    overall_status = "ok" if gemini_status == "ok" else "degraded"
    
    return JSONResponse(
        status_code=200 if overall_status == "ok" else 503,
        content={
            "status": overall_status,
            "services": {
                "gemini": {
                    "status": gemini_status,
                    "sdk_available": GEMINI_AVAILABLE,
                    "api_key_configured": settings.has_gemini_key
                },
                "pdf_extraction": {
                    "status": pdf_status,
                    "available_libraries": pdf_libs
                }
            },
            "timestamp": "2025-09-15T14:43:57-03:00"
        }
    )
