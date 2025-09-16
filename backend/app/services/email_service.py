"""
Serviço para processamento de emails
"""
import asyncio
from typing import Optional, Dict
from fastapi import UploadFile

from app.utils.pdf_extractor import extract_text_from_pdf_bytes
from app.services.gemini_service import gemini_service


class EmailService:
    """Serviço para processamento e classificação de emails"""
    
    async def extract_content_from_file(self, file: UploadFile) -> str:
        """
        Extrai conteúdo de um arquivo enviado
        
        Args:
            file: Arquivo enviado via upload
            
        Returns:
            str: Conteúdo extraído do arquivo
            
        Raises:
            ValueError: Se o arquivo estiver vazio ou formato não suportado
        """
        filename = (file.filename or "").lower()
        raw_bytes = await file.read()
        
        if not raw_bytes:
            raise ValueError("Arquivo vazio ou upload falhou.")
        
        if filename.endswith(".txt"):
            return raw_bytes.decode("utf-8", errors="ignore")
        elif filename.endswith(".pdf"):
            content = extract_text_from_pdf_bytes(raw_bytes)
            if not content:
                raise ValueError("Não foi possível extrair texto deste PDF (pode ser escaneado).")
            return content
        else:
            raise ValueError("Formato não suportado. Envie .txt ou .pdf")
    
    def validate_content(self, content: str) -> str:
        """
        Valida e limpa o conteúdo do email
        
        Args:
            content: Conteúdo a ser validado
            
        Returns:
            str: Conteúdo validado e limpo
            
        Raises:
            ValueError: Se o conteúdo estiver vazio
        """
        if not content or not content.strip():
            raise ValueError("Conteúdo do email está vazio.")
        
        return content.strip()
    
    async def classify_email_async(self, content: str, generate_reply: bool = False, detailed_analysis: bool = False) -> Dict:
        """
        Classifica um email de forma assíncrona
        
        Args:
            content: Conteúdo do email
            generate_reply: Se deve gerar uma resposta automática
            detailed_analysis: Se deve gerar análise detalhada
            
        Returns:
            Dict: Resultado da classificação
        """
        loop = asyncio.get_event_loop()
        
        def _classify():
            return gemini_service.classify_email(content, generate_reply, detailed_analysis)
        
        return await loop.run_in_executor(None, _classify)
    
    async def process_email_request(
        self, 
        text: Optional[str] = None, 
        file: Optional[UploadFile] = None, 
        generate_reply: bool = False,
        detailed_analysis: bool = False
    ) -> Dict:
        """
        Processa uma requisição completa de classificação de email
        
        Args:
            text: Texto do email (opcional)
            file: Arquivo com o email (opcional)
            generate_reply: Se deve gerar uma resposta automática
            
        Returns:
            Dict: Resultado da classificação
            
        Raises:
            ValueError: Se não houver conteúdo ou erro na extração
            RuntimeError: Se houver erro na classificação
        """
        # Extrai conteúdo
        content = ""
        
        if file is not None:
            content = await self.extract_content_from_file(file)
        elif text:
            content = text
        else:
            raise ValueError("Nenhum texto ou arquivo enviado.")
        
        # Valida conteúdo
        content = self.validate_content(content)
        
        # Classifica o email
        try:
            result = await self.classify_email_async(content, generate_reply, detailed_analysis)
        except Exception as e:
            raise RuntimeError(f"Erro ao classificar email: {e}")
        
        return result


# Instância singleton do serviço
email_service = EmailService()
