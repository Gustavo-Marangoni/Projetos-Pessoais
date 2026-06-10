# 📋 TaskManager — Full Stack App

Aplicação full stack de gerenciamento de tarefas com autenticação JWT, CRUD completo, filtros, estatísticas e sugestões de IA via Claude.

## 🧱 Tecnologias

### Back-end
- **Node.js + Express** — servidor REST API
- **Prisma ORM + SQLite** — banco de dados
- **JWT + bcrypt** — autenticação segura
- **CORS + express-validator** — segurança e validação

### Front-end
- **React 18 + Vite** — interface reativa
- **React Router v6** — navegação SPA
- **Axios** — requisições HTTP
- **Context API** — gerenciamento de estado

### API Externa
- **Anthropic Claude API** — sugestões de produtividade com IA

---

## 🚀 Como rodar localmente

### 1. Clone o repositório
```bash
git clone https://github.com/seu-usuario/taskmanager.git
cd taskmanager
```

### 2. Back-end
```bash
cd backend
npm install
cp .env.example .env
# Edite o .env com suas chaves
npx prisma migrate dev --name init
npm run dev
```

### 3. Front-end
```bash
cd frontend
npm install
cp .env.example .env
# Edite o .env com a URL do back-end
npm run dev
```

Acesse: `http://localhost:5173`

---

## 📁 Estrutura

```
taskmanager/
├── backend/
│   ├── src/
│   │   ├── controllers/    # Lógica de negócio
│   │   ├── middleware/     # Auth JWT, validação
│   │   ├── routes/         # Definição das rotas
│   │   └── prisma/         # Schema do banco
│   ├── server.js
│   └── package.json
├── frontend/
│   ├── src/
│   │   ├── components/     # Componentes reutilizáveis
│   │   ├── pages/          # Páginas da aplicação
│   │   ├── hooks/          # Custom hooks
│   │   ├── services/       # Chamadas de API
│   │   └── context/        # Estado global
│   └── package.json
└── README.md
```

---

## 🔑 Variáveis de Ambiente

### Backend `.env`
```
DATABASE_URL="file:./dev.db"
JWT_SECRET="sua-chave-secreta-aqui"
ANTHROPIC_API_KEY="sk-ant-..."
PORT=3001
```

### Frontend `.env`
```
VITE_API_URL=http://localhost:3001
```

---

## 📡 Endpoints da API

| Método | Rota | Descrição | Auth |
|--------|------|-----------|------|
| POST | /auth/register | Criar conta | ❌ |
| POST | /auth/login | Login | ❌ |
| GET | /tasks | Listar tarefas | ✅ |
| POST | /tasks | Criar tarefa | ✅ |
| PUT | /tasks/:id | Atualizar tarefa | ✅ |
| DELETE | /tasks/:id | Deletar tarefa | ✅ |
| GET | /tasks/stats | Estatísticas | ✅ |
| POST | /ai/suggest | Sugestão de IA | ✅ |

---

## ✨ Funcionalidades

- ✅ Registro e login com JWT
- ✅ CRUD completo de tarefas
- ✅ Filtro por status (pendente, em andamento, concluída)
- ✅ Busca por título
- ✅ Dashboard com gráfico de produtividade
- ✅ Sugestões de tarefas por IA
- ✅ Design responsivo com dark mode

---

## 🤝 Contribuindo

Pull requests são bem-vindos! Abra uma issue para discutir mudanças maiores.

## 📄 Licença

MIT
