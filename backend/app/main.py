"""
Aplicação principal FastAPI - Classificador de Emails AutoU
"""
from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware

from app.config import settings
from app.routes.email_routes import router as email_router
from app.routes.health_routes import router as health_router


def create_app() -> FastAPI:
    """
    Factory function para criar a aplicação FastAPI
    
    Returns:
        FastAPI: Instância da aplicação configurada
    """
    app = FastAPI(
        title=settings.APP_TITLE,
        version=settings.APP_VERSION,
        description="API para classificação automática de emails usando Gemini AI"
    )
    
    # Configurar CORS
    app.add_middleware(
        CORSMiddleware,
        allow_origins=settings.CORS_ORIGINS,
        allow_methods=settings.CORS_METHODS,
        allow_headers=settings.CORS_HEADERS,
        allow_credentials=settings.CORS_CREDENTIALS,
    )
    
    # Registrar rotas
    app.include_router(health_router)
    app.include_router(email_router)
    
    return app


# Criar instância da aplicação
app = create_app()
