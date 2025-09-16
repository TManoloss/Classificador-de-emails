"""
Serviço para integração com Gemini AI
"""
import os
from typing import Dict, Optional

from app.config import settings

# Gemini SDK
GEMINI_AVAILABLE = False
try:
    from google import genai
    GEMINI_AVAILABLE = True
except Exception:
    genai = None
    GEMINI_AVAILABLE = False


class GeminiService:
    """Serviço para classificação de emails usando Gemini AI"""
    
    def __init__(self):
        self.api_key = settings.GEMINI_API_KEY
        self.model_name = settings.GEMINI_MODEL
        self._client = None
    
    @property
    def client(self):
        """Lazy loading do client Gemini"""
        if self._client is None:
            if not self.api_key:
                raise RuntimeError("GEMINI_API_KEY não definida.")
            if not GEMINI_AVAILABLE:
                raise RuntimeError("google-genai SDK não instalado (pip install google-genai)")
            self._client = genai.Client(api_key=self.api_key)
        return self._client
    
    def _build_classify_prompt(self, content: str) -> str:
        """
        Constrói o prompt para classificação de email
        
        Args:
            content: Conteúdo do email
            
        Returns:
            str: Prompt formatado
        """
        return (
            "Classifique o texto do email abaixo seguindo este formato exato:\n"
            "CATEGORIA: [Produtivo ou Improdutivo]\n"
            "PRIORIDADE: [Alta, Média ou Baixa]\n\n"
            "Critérios:\n"
            "- Produtivo: requer ação/resposta, emails de trabalho, reunioes, problemas e urgências\n"
            "- Improdutivo: não requer ação, parabenizacoes de cumprimento, festas e aniversarios\n"
            "- Alta: urgente, prazo apertado, problema crítico\n"
            "- Média: importante mas não urgente\n"
            "- Baixa: informativo, rotineiro\n\n"
            f"EMAIL:\n{content}\n\n"
            "RESPOSTA:"
        )
    
    def _build_detailed_analysis_prompt(self, content: str, categoria: str) -> str:
        """Constrói o prompt para análise detalhada"""
        return f"""
Faça uma análise detalhada deste email classificado como '{categoria}'. 
Inclua os seguintes pontos em sua análise:

1. Motivo da classificação
2. Elementos-chave identificados no conteúdo
3. Urgência e prioridade
4. Ações recomendadas
5. Contexto e observações relevantes

EMAIL:
{content}

ANÁLISE DETALHADA:
"""

    def _build_reply_prompt(self, content: str, categoria: str) -> str:
        """Constrói o prompt para gerar resposta automática"""
        return f"""
Baseado neste email classificado como '{categoria}', gere uma resposta profissional e adequada em português:

EMAIL:
{content}

RESPOSTA:
"""
    
    def _normalize_classification(self, response_text: str) -> Dict:
        """
        Normaliza a resposta da classificação incluindo prioridade
        
        Args:
            response_text: Texto da resposta do Gemini
            
        Returns:
            Dict: Categoria e prioridade normalizadas
        """
        normalized_text = response_text.lower().strip()
        
        # Extrai categoria
        categoria = None
        if "categoria:" in normalized_text:
            categoria_line = [line for line in normalized_text.split('\n') if 'categoria:' in line]
            if categoria_line:
                categoria_text = categoria_line[0].split('categoria:')[1].strip()
                if "improdutivo" in categoria_text and "produtivo" not in categoria_text:
                    categoria = "Improdutivo"
                elif "produtivo" in categoria_text and "improdutivo" not in categoria_text:
                    categoria = "Produtivo"
                elif "" in categoria_text:
                    categoria = "improdutivo"
        
        # Fallback para categoria
        if not categoria:
            if "improdutivo" in normalized_text and "produtivo" not in normalized_text:
                categoria = "Improdutivo"
            elif "produtivo" in normalized_text and "improdutivo" not in normalized_text:
                categoria = "Produtivo"
        
        # Extrai prioridade
        prioridade = None
        if "prioridade:" in normalized_text:
            prioridade_line = [line for line in normalized_text.split('\n') if 'prioridade:' in line]
            if prioridade_line:
                prioridade_text = prioridade_line[0].split('prioridade:')[1].strip()
                if "alta" in prioridade_text:
                    prioridade = "Alta"
                elif "média" in prioridade_text or "media" in prioridade_text:
                    prioridade = "Média"
                elif "baixa" in prioridade_text:
                    prioridade = "Baixa"
        
        # Fallback para prioridade baseado na categoria
        if not prioridade:
            if categoria == "Produtivo":
                # Analisa palavras-chave para determinar prioridade
                if any(word in normalized_text for word in ["urgente", "crítico", "emergência", "imediato", "asap"]):
                    prioridade = "Alta"
                elif any(word in normalized_text for word in ["importante", "necessário", "preciso"]):
                    prioridade = "Média"
                else:
                    prioridade = "Baixa"
            else:
                prioridade = "Baixa"
        
        return {
            "categoria": categoria,
            "prioridade": prioridade
        }
    
    def classify_email(self, content: str, generate_reply: bool = False, detailed_analysis: bool = False) -> Dict:
        """
        Classifica um email e opcionalmente gera uma resposta
        
        Args:
            content: Conteúdo do email
            generate_reply: Se deve gerar uma resposta automática
            detailed_analysis: Se deve gerar análise detalhada
            
        Returns:
            Dict: Resultado da classificação com keys: 'categoria', 'gemini_raw' e opcionalmente 'reply'
        """
        try:
            result = self._call_gemini_classify_and_optional_reply(content, generate_reply, detailed_analysis)
            return result
        except Exception as e:
            raise RuntimeError(f"Erro ao chamar Gemini AI: {e}")
    
    def _call_gemini_classify_and_optional_reply(self, content: str, generate_reply: bool, detailed_analysis: bool = False) -> Dict:
        """
        Classifica um email e opcionalmente gera uma resposta
        
        Args:
            content: Conteúdo do email
            generate_reply: Se deve gerar uma resposta automática
            
        Returns:
            Dict: Resultado da classificação com keys: 'categoria', 'gemini_raw' e opcionalmente 'reply'
        """
        # Prompt de classificação
        classify_prompt = self._build_classify_prompt(content)
        
        # Chamada à API do Gemini
        response = self.client.models.generate_content(
            model=self.model_name, 
            contents=classify_prompt
        )
        label_text = (getattr(response, "text", "") or "").strip()
        
        # Normaliza a classificação
        classification_result = self._normalize_classification(label_text)
        categoria = classification_result.get("categoria")
        prioridade = classification_result.get("prioridade")
        
        result = {
            "categoria": categoria,
            "prioridade": prioridade,
            "gemini_raw": label_text
        }
        
        # Gera análise detalhada opcional
        if detailed_analysis and categoria is not None:
            analysis_prompt = self._build_detailed_analysis_prompt(content, categoria)
            analysis_response = self.client.models.generate_content(
                model=self.model_name,
                contents=analysis_prompt
            )
            analysis_text = (getattr(analysis_response, "text", "") or "").strip()
            result["detailed_analysis"] = analysis_text
        
        # Gera resposta opcional
        if generate_reply and categoria is not None:
            reply_prompt = self._build_reply_prompt(content, categoria)
            reply_response = self.client.models.generate_content(
                model=self.model_name,
                contents=reply_prompt
            )
            reply_text = (getattr(reply_response, "text", "") or "").strip()
            result["reply"] = reply_text
        
        return result
    
    def is_available(self) -> bool:
        """Verifica se o serviço está disponível"""
        return GEMINI_AVAILABLE and bool(self.api_key)


# Instância singleton do serviço
gemini_service = GeminiService()
