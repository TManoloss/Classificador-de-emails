# AutoU - Classificador de Emails

Sistema de classificação automática de emails usando Inteligência Artificial (Gemini AI) para identificar se um email é produtivo ou improdutivo, além de sugerir prioridades e respostas automáticas.

## Estrutura do Projeto

```
.
├── backend/           # API em FastAPI
├── frontend/          # Interface web em HTML/JS puro
└── README.md          # Este arquivo
```

## Como Fazer o Deploy

### 1. Backend (API)

Siga as instruções em [backend/README.md](backend/README.md) para fazer o deploy da API.

**Serviços recomendados:**
- [Render.com](https://render.com/)
- [Railway.app](https://railway.app/)
- [Heroku](https://www.heroku.com/)

### 2. Frontend (Interface Web)

Siga as instruções em [frontend/README.md](frontend/README.md) para fazer o deploy do frontend.

**Serviços recomendados:**
- [Vercel](https://vercel.com/)
- [Netlify](https://www.netlify.com/)
- [GitHub Pages](https://pages.github.com/)

### 3. Configuração Pós-Deploy

1. Após fazer o deploy do backend, anote a URL base da API (ex: `https://seu-backend.onrender.com`)
2. No frontend, atualize a variável `apiBaseUrl` no arquivo `frontend/js/config.js` com a URL do seu backend
3. Faça o deploy do frontend com a configuração atualizada

## Variáveis de Ambiente

### Backend

| Variável | Obrigatória | Descrição |
|----------|-------------|-----------|
| GEMINI_API_KEY | Sim | Chave de API do Google Gemini |
| PORT | Não | Porta do servidor (geralmente definida pelo provedor) |

### Frontend

Por padrão, o frontend tenta se conectar ao backend no mesmo domínio. Se o backend estiver em um domínio diferente, atualize a variável `apiBaseUrl` em `frontend/js/config.js`.

## Desenvolvimento Local

### Backend

```bash
cd backend
python -m venv venv
source venv/bin/activate  # Linux/Mac
# ou
.\venv\Scripts\activate  # Windows

pip install -r requirements.txt
uvicorn main:app --reload
```

### Frontend

```bash
cd frontend
npx serve -s .
```

Acesse `http://localhost:3000` no navegador.

## Licença

Este projeto está licenciado sob a licença MIT - veja o arquivo [LICENSE](LICENSE) para mais detalhes.
