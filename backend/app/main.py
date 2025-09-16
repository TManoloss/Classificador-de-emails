"""
Aplicação principal FastAPI - Classificador de Emails AutoU
"""
import logging
from typing import List

from fastapi import FastAPI, UploadFile, File, Form, HTTPException, Request
from fastapi.middleware.cors import CORSMiddleware
from fastapi.responses import JSONResponse

from app.config import settings
from app.routes.email_routes import router as email_router
from app.routes.health_routes import router as health_router

# Configurar logger
logging.basicConfig(level=logging.INFO)
logger = logging.getLogger("autou")

def normalize_origins(origins: List[str]) -> List[str]:
    """
    Remove barras finais e espaços em branco das origens,
    e retorna origens válidas. Se vazio, retorna lista vazia.
    """
    if not origins:
        return []
    cleaned = []
    for o in origins:
        if not o:
            continue
        o = o.strip()
        # remover barra final (somente se não for apenas 'http://localhost/')
        if o.endswith("/"):
            o = o[:-1]
        if o:
            cleaned.append(o)
    return cleaned

def create_app() -> FastAPI:
    """
    Factory function para criar a aplicação FastAPI
    """
    app = FastAPI(
        title=settings.APP_TITLE,
        version=settings.APP_VERSION,
        description="API para classificação automática de emails usando Gemini AI"
    )

    # Normaliza as origens do settings e adiciona origens de dev úteis
    origins = normalize_origins(getattr(settings, "CORS_ORIGINS", []) or [])
    # acrescenta origens locais para facilitar debug (não afeta produção)
    local_debug_origins = ["http://localhost:5500", "http://127.0.0.1:5500", "http://localhost:3000"]
    for ld in local_debug_origins:
        if ld not in origins:
            origins.append(ld)

    if not origins:
        # segurança: se não houver origens configuradas, podemos usar ["*"] temporariamente
        logger.warning("Nenhuma origem CORS configurada. Usando '*' temporariamente (só para testes).")
        cors_allow = ["*"]
    else:
        cors_allow = origins

    logger.info("CORS will allow origins: %s", cors_allow)

    app.add_middleware(
        CORSMiddleware,
        allow_origins=cors_allow,
        allow_methods=getattr(settings, "CORS_METHODS", ["*"]),
        allow_headers=getattr(settings, "CORS_HEADERS", ["*"]),
        allow_credentials=getattr(settings, "CORS_CREDENTIALS", True),
    )

    # Registrar rotas existentes
    app.include_router(health_router)
    app.include_router(email_router)

    # Endpoint de teste leve para isolar CORS / 502 (NÃO utilizar em produção permanente)
    @app.post("/classify_test")
    async def classify_test(
        text: str = Form(None),
        file: UploadFile = File(None),
        gen_reply: str = Form("false"),
        detailed_analysis: str = Form("false"),
    ):
        """
        Handler de teste simples: não chama Gemini. Use para validar CORS e fluxo.
        """
        try:
            content = text or ""
            if file:
                data = await file.read()
                try:
                    content = data.decode("utf-8", errors="ignore")
                except Exception:
                    content = "[arquivo binário ou não-decifrável]"

            content_lower = content.lower()
            categoria = "Produtivo" if ("status" in content_lower or "ordem" in content_lower or "preciso" in content_lower) else "Improdutivo"
            prioridade = "Alta" if "urgente" in content_lower else "Média"

            return {
                "categoria": categoria,
                "prioridade": prioridade,
                "label": categoria,
                "score": 0.95 if categoria == "Produtivo" else 0.6,
                "raw_text_preview": content[:1000],
            }
        except Exception as e:
            logger.exception("Erro no classify_test: %s", e)
            raise HTTPException(status_code=500, detail="Erro interno de teste")

    # Handler global de exceções — evita que o app crash gere 502 sem mensagem
    @app.exception_handler(Exception)
    async def global_exception_handler(request: Request, exc: Exception):
        logger.exception("Unhandled exception: %s", exc)
        return JSONResponse(
            status_code=500,
            content={"error": "Erro interno do servidor. Verifique logs."},
        )

    return app


# Criar instância da aplicação
app = create_app()
