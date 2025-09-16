"""
Ponto de entrada principal da aplicação - Classificador de Emails AutoU
Este arquivo mantém compatibilidade com o deploy existente
"""
from app.main import app

# Para compatibilidade com deploy existente, exportamos a instância app
__all__ = ["app"]
