"""
Rotas para classificação de emails
"""
from typing import Optional
from fastapi import APIRouter, Form, File, UploadFile
from fastapi.responses import JSONResponse

from app.services.email_service import email_service

router = APIRouter(prefix="/api", tags=["email"])


@router.post("/classify")
async def classify_email(
    text: Optional[str] = Form(None),
    file: Optional[UploadFile] = File(None),
    gen_reply: Optional[bool] = Form(False),
    detailed_analysis: Optional[bool] = Form(False)
):
    """
    Classifica um email como Produtivo ou Improdutivo
    
    Args:
        text: Texto do email (opcional)
        file: Arquivo com o email (.txt ou .pdf) (opcional)
        gen_reply: Se deve gerar uma resposta automática
        
    Returns:
        JSONResponse: Resultado da classificação
    """
    try:
        result = await email_service.process_email_request(
            text=text,
            file=file,
            generate_reply=bool(gen_reply),
            detailed_analysis=bool(detailed_analysis)
        )
        
        # Se não conseguiu classificar com confiança
        # if result.get("categoria") is None:
        #     return JSONResponse(
        #         status_code=200,
        #         content={
        #             "categoria": None,
        #             "gemini_raw": result.get("gemini_raw"),
        #             "message": "Não foi possível classificar com confiança"
        #         }
        #     )
        
        # Resposta de sucesso
        response_data = {
            "categoria": result["categoria"],
            "prioridade": result.get("prioridade"),
            "label": "GEMINI",
            "gemini_raw": result.get("gemini_raw")
        }
        
        if "reply" in result:
            response_data["reply"] = result["reply"]
        
        if "detailed_analysis" in result:
            response_data["detailed_analysis"] = result["detailed_analysis"]
        
        return JSONResponse(status_code=200, content=response_data)
        
    except ValueError as e:
        return JSONResponse(
            status_code=400,
            content={"error": str(e)}
        )
    except RuntimeError as e:
        return JSONResponse(
            status_code=500,
            content={"error": str(e)}
        )
    except Exception as e:
        return JSONResponse(
            status_code=500,
            content={"error": f"Erro interno: {e}"}
        )
