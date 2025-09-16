# Arquitetura do Backend - Classificador de Emails AutoU

## Visão Geral

O backend foi completamente refatorado para seguir uma arquitetura modular e escalável, separando responsabilidades e facilitando manutenção e testes.

## Estrutura de Pastas

```
backend/
├── app/
│   ├── __init__.py
│   ├── main.py              # Factory da aplicação FastAPI
│   ├── config.py            # Configurações centralizadas
│   ├── routes/              # Endpoints da API
│   │   ├── __init__.py
│   │   ├── email_routes.py  # Rotas para classificação
│   │   └── health_routes.py # Rotas de health check
│   ├── services/            # Lógica de negócio
│   │   ├── __init__.py
│   │   ├── gemini_service.py    # Integração com Gemini AI
│   │   └── email_service.py     # Processamento de emails
│   └── utils/               # Utilitários
│       ├── __init__.py
│       └── pdf_extractor.py # Extração de texto de PDFs
├── main.py                  # Ponto de entrada (compatibilidade)
├── requirements.txt
└── Procfile
```

## Componentes Principais

### 1. Configuration (`app/config.py`)
- Centraliza todas as configurações da aplicação
- Carrega variáveis de ambiente
- Define configurações de CORS, API keys, etc.
- Classe `Settings` com validações

### 2. Services (`app/services/`)

#### GeminiService (`gemini_service.py`)
- Gerencia integração com Gemini AI
- Lazy loading do client
- Métodos para classificação e geração de respostas
- Tratamento de erros específicos

#### EmailService (`email_service.py`)
- Orquestra o processamento completo de emails
- Extração de conteúdo de arquivos
- Validação de dados
- Execução assíncrona da classificação

### 3. Routes (`app/routes/`)

#### Email Routes (`email_routes.py`)
- Endpoint `/api/classify` para classificação
- Validação de entrada
- Tratamento de erros HTTP

#### Health Routes (`health_routes.py`)
- Endpoint `/` para health check básico
- Endpoint `/health` para status detalhado
- Monitoramento de serviços

### 4. Utils (`app/utils/`)

#### PDF Extractor (`pdf_extractor.py`)
- Extração robusta de texto de PDFs
- Múltiplas bibliotecas como fallback
- Tratamento de erros

## Princípios Aplicados

### 1. Separation of Concerns
- Cada módulo tem uma responsabilidade específica
- Lógica de negócio separada dos endpoints
- Configurações centralizadas

### 2. Dependency Injection
- Serviços como singletons
- Fácil substituição para testes
- Baixo acoplamento

### 3. Error Handling
- Tratamento específico por tipo de erro
- Mensagens de erro claras
- Status codes HTTP apropriados

### 4. Async/Await
- Operações não-bloqueantes
- Melhor performance
- Uso de executors para operações síncronas

## Benefícios da Nova Arquitetura

### Escalabilidade
- Fácil adição de novos endpoints
- Novos serviços podem ser adicionados facilmente
- Estrutura preparada para crescimento

### Manutenibilidade
- Código organizado e limpo
- Responsabilidades bem definidas
- Fácil localização de bugs

### Testabilidade
- Componentes isolados
- Mocking facilitado
- Testes unitários por módulo

### Reutilização
- Serviços podem ser reutilizados
- Utilitários compartilhados
- Configurações centralizadas

## Fluxo de Execução

1. **Requisição** → `email_routes.py`
2. **Validação** → `EmailService.process_email_request()`
3. **Extração** → `pdf_extractor.py` (se arquivo)
4. **Classificação** → `GeminiService.classify_email()`
5. **Resposta** → JSON formatado

## Compatibilidade

O arquivo `main.py` na raiz mantém compatibilidade com o deploy existente, importando a aplicação da nova estrutura.

## Próximos Passos

- Adicionar testes unitários
- Implementar logging estruturado
- Adicionar métricas e monitoramento
- Implementar cache para respostas
- Adicionar validação com Pydantic models
