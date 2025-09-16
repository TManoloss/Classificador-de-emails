# AutoU - Sistema de Análise de Documentos

Bem-vindo ao AutoU, uma aplicação web para análise e processamento de documentos utilizando IA.

## 📋 Pré-requisitos

- Python 3.8+
- Node.js 14+ (para o frontend)
- pip (gerenciador de pacotes Python)
- npm ou yarn (gerenciador de pacotes Node.js)

## 🚀 Configuração do Ambiente

### 1. Clonar o repositório

```bash
git clone https://github.com/TManoloss/Classificador-de-emails.git
cd AutoU/Novo
```

### 2. Configurar o Backend

1. Crie e ative um ambiente virtual:
   ```bash
   # Linux/MacOS
   python -m venv venv
   source venv/bin/activate

   # Windows
   python -m venv venv
   .\venv\Scripts\activate
   ```

2. Instale as dependências do backend:
   ```bash
   cd backend
   pip install -r requirements.txt
   ```

3. Configure as variáveis de ambiente:
   Crie um arquivo `.env` na pasta `backend` com as seguintes variáveis:
   ```
   GEMINI_API_KEY=sua_chave_aqui
   ```


## 🏃‍♂️ Executando a Aplicação

### Backend

Na pasta `backend`, execute:
```bash
uvicorn main:app --reload
```
O servidor estará disponível em `http://localhost:8000`

### Frontend

Na pasta `frontend`, você pode usar um servidor simples do Python para servir os arquivos estáticos:
```bash
# Python 3
python -m http.server 3000
```

Ou use o Live Server do VS Code:
1. Instale a extensão "Live Server"
2. Clique com o botão direito em `index.html` e selecione "Open with Live Server"

A aplicação estará disponível em `http://localhost:3000`

## 🛠 Tecnologias Utilizadas

### Backend
- Python 3.8+
- FastAPI
- Uvicorn
- Google Generative AI
- Outras bibliotecas listadas em `requirements.txt`

### Frontend
- HTML5
- CSS3
- JavaScript Vanilla

## 📂 Estrutura do Projeto

```
.
├── backend/           # Código-fonte do backend
│   ├── app/           # Módulos da aplicação
│   ├── main.py        # Ponto de entrada da aplicação
│   └── requirements.txt
├── frontend/          # Código-fonte do frontend
│   ├── assets/        # Arquivos estáticos
│   ├── css/           # Folhas de estilo
│   ├── js/            # Código JavaScript
│   └── index.html     # Página principal
└── README.md          # Este arquivo
```

## 📄 Licença

Este projeto está sob a licença MIT. Veja o arquivo [LICENSE](LICENSE) para mais detalhes.



