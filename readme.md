# Classificador de Emails Produtivo/Improdutivo - AutoU

Este projeto é uma aplicação web que utiliza **FastAPI** no backend (Python) e **HTML/CSS/JavaScript** no frontend. A aplicação permite classificar emails como "Produtivo" ou "Improdutivo" e gerar respostas automáticas usando **Gemini AI**.

## Funcionalidades

- **Upload de email:** Entrada de texto diretamente ou upload de arquivo `.txt` ou `.pdf`.
- **Extração robusta de PDFs:** Múltiplas bibliotecas como fallback (PyPDF2, PyMuPDF, pdfplumber).
- **Classificação inteligente:** Uso da API do Gemini para determinar se o email é **"Produtivo"** ou **"Improdutivo"**.
- **Resposta automática:** Geração de resposta contextual ao email via Gemini AI.
- **Frontend responsivo:** Interface intuitiva para inserção do email e exibição dos resultados.
- **Health checks:** Monitoramento do status dos serviços e dependências.

## Tecnologias Utilizadas

- **Backend:** FastAPI (Python), Gemini AI, múltiplas bibliotecas PDF
- **Frontend:** HTML, CSS e JavaScript puro
- **Arquitetura:** Modular e escalável seguindo princípios SOLID
- **Deploy:** Backend otimizado para Render.com, Frontend para Vercel.com

## Nova Arquitetura (Refatorada)

O projeto foi completamente refatorado para uma arquitetura modular e escalável:

### Estrutura do Backend

```
backend/
├── app/
│   ├── main.py              # Factory da aplicação FastAPI
│   ├── config.py            # Configurações centralizadas
│   ├── routes/              # Endpoints da API
│   │   ├── email_routes.py  # Rotas para classificação
│   │   └── health_routes.py # Health checks
│   ├── services/            # Lógica de negócio
│   │   ├── gemini_service.py    # Integração Gemini AI
│   │   └── email_service.py     # Processamento emails
│   └── utils/               # Utilitários
│       └── pdf_extractor.py # Extração de PDFs
├── main.py                  # Ponto de entrada
├── requirements.txt
└── docs/
    └── ARCHITECTURE.md      # Documentação detalhada
```

### Benefícios da Refatoração

- **Escalabilidade:** Fácil adição de novos recursos e endpoints
- **Manutenibilidade:** Código organizado com responsabilidades bem definidas
- **Testabilidade:** Componentes isolados facilitam testes unitários
- **Reutilização:** Serviços e utilitários podem ser reutilizados
- **Configuração:** Configurações centralizadas e flexíveis

## Endpoints da API

### Classificação de Email
```
POST /api/classify
```
- **Parâmetros:** `text` (string) ou `file` (arquivo .txt/.pdf), `gen_reply` (boolean)
- **Resposta:** Categoria do email e resposta automática (opcional)

### Health Checks
```
GET /          # Status básico
GET /health    # Status detalhado dos serviços
```

## Instalação e Execução

### Backend

1. **Instalar dependências:**
```bash
cd backend
pip install -r requirements.txt
```

2. **Configurar variáveis de ambiente:**
```bash
# Criar arquivo .env
GEMINI_API_KEY=sua_chave_aqui
```

3. **Executar servidor:**
```bash
python3 -m uvicorn main:app --reload --host 0.0.0.0 --port 8000
```

### Frontend

1. **Abrir arquivo:**
```bash
cd frontend
# Abrir index.html no navegador ou servir com servidor local
```

## Configuração do Gemini AI

1. Obter chave da API no [Google AI Studio](https://makersuite.google.com/app/apikey)
2. Definir a variável `GEMINI_API_KEY` no ambiente ou arquivo `.env`
3. O sistema detectará automaticamente a disponibilidade do serviço

## Monitoramento

A aplicação inclui endpoints de health check que monitoram:
- Status do Gemini AI (SDK e chave de API)
- Bibliotecas de PDF disponíveis
- Status geral da aplicação

## Deploy

### Backend (Render.com)
- O `Procfile` está configurado para deploy automático
- Definir `GEMINI_API_KEY` nas variáveis de ambiente do Render

### Frontend (Vercel.com)
- Deploy direto da pasta `frontend/`
- Configurar URL do backend nas variáveis de ambiente

## Desenvolvimento

Para contribuir com o projeto:

1. A arquitetura modular facilita a adição de novos recursos
2. Seguir os padrões estabelecidos em cada módulo
3. Consultar `docs/ARCHITECTURE.md` para detalhes técnicos
4. Adicionar testes para novos componentes

## Licença

Projeto desenvolvido para processo seletivo AutoU.
