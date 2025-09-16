"""
Configurações da aplicação
"""
import os
from dotenv import load_dotenv

# Carrega variáveis de ambiente
load_dotenv()

class Settings:
    """Configurações da aplicação"""
    
    # API Keys
    GEMINI_API_KEY: str = os.getenv("GEMINI_API_KEY") or os.getenv("GOOGLE_API_KEY", "")
    
    # Gemini Model
    GEMINI_MODEL: str = "gemini-1.5-flash"
    
    # CORS Settings
    CORS_ORIGINS: list = ["*"]  # Em produção, restringir ao domínio do frontend
    CORS_METHODS: list = ["*"]
    CORS_HEADERS: list = ["*"]
    CORS_CREDENTIALS: bool = True
    
    # App Settings
    APP_TITLE: str = "Classificador de Emails - AutoU"
    APP_VERSION: str = "1.0.0"
    
    @property
    def has_gemini_key(self) -> bool:
        """Verifica se a chave do Gemini está configurada"""
        return bool(self.GEMINI_API_KEY)

settings = Settings()
