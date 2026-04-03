# Lumus

Lumus é uma aplicação full-stack criada durante um hackathon de startups. Em 10 horas de competição (com apenas 4 horas para desenvolvimento do MVP), nossa equipe construiu uma solução para pequenos e médios empresários aprenderem a vender melhor seus produtos.

O projeto combina um chat com Inteligência Artificial focado em vendas e uma página de cursos em texto, oferecendo suporte prático para PMEs evoluírem suas estratégias comerciais.

Projeto realizado em 22 de novembro de 2025.

## Equipe

# Desenvolvedores

- [Lorenzo (GitHub)](https://github.com/Paludett) - Dev/Negócios 
- [Murilo (GitHub)](https://github.com/Muller-SR) - Dev
- [Heitor (LinkedIn)](https://www.linkedin.com/in /heitor-bettega-1bb078264/) - Negócios
- [Richard (LinkedIn)](https://www.linkedin.com/in/richard-matge-994838382/) - Negócios / Pitch 

## Tech Stack
- Python
- FastAPI
- React
- TypeScript
- PostgreSQL
- Docker
- Gemini API

## Architecture Overview
O frontend React/Vite envia requisições HTTP para o backend em Python/FastAPI para listar, detalhar e gerenciar cursos. O backend usa PostgreSQL para persistência e expõe também o endpoint de chat que consulta o Gemini para gerar respostas. Migrações de banco são controladas por Alembic.

## Prerequisites
- Node.js 18+
- Python 3.11+
- Docker (optional)

## Setup (Sem Docker)

### 1) Backend
1. `cd backend`
2. Crie seu arquivo de ambiente a partir de `backend/.env.example`.
3. Crie e ative um ambiente virtual Python.
4. Instale dependências: `pip install -r requirements.txt`
5. Rode migrações Alembic: `alembic upgrade head`
6. Inicie a API: `uvicorn main:app --reload --host 0.0.0.0 --port 8000`

### 2) Frontend
1. `cd frontend`
2. Crie seu arquivo de ambiente a partir de `frontend/.env.example`.
3. Instale dependências: `npm install`
4. Inicie o app: `npm run dev`

## Setup (Com Docker)
1. Crie o arquivo de ambiente do backend: `cp backend/.env.example backend/.env`
2. Na raiz do projeto, suba os containers (DB + backend): `docker compose up --build -d`
3. Rode as migrações no container do backend: `docker compose exec backend alembic upgrade head`
4. Reinicie o backend para executar o seed automático após as migrações: `docker compose restart backend`
5. Frontend (fora do Docker): `cd frontend && npm i && npm run dev`
6. Backend disponível em `http://localhost:8000` e frontend em `http://localhost:5173`

## Environment Variables
Use os exemplos como referência:
- `backend/.env.example`
- `frontend/.env.example`

## API Endpoints

| Method | Endpoint | Description |
|--------|----------|-------------|
| GET | /courses | Lista todos os curso |
| GET | /courses/{id} | Lista os cursos pelo ID |
| POST | /courses | Cria um curso |
| PUT | /courses/{id} | Atualiza um curso |
| DELETE | /courses/{id} | Deleta um curso |
| POST | /chat | Chat com a IA |
| GET | /docs | Documetancao da Api |

## Screenshot
Add a screenshot here
