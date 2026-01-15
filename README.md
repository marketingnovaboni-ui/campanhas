# Planner Fornecedores 2026

App web para reservas de campanhas e calendário de ações entre março e dezembro de 2026.

## Requisitos

- Node.js 18+
- Docker (para PostgreSQL local)

## Setup

```bash
docker compose up -d
```

Crie um arquivo `.env` com a conexão:

```bash
DATABASE_URL="postgresql://planner:planner@localhost:5432/planner?schema=public"
```

Instale dependências e rode migrations:

```bash
npm install
npm run prisma:generate
npm run prisma:migrate
npm run seed
 npx playwright install
```

## Executar

```bash
npm run dev
```

Acesse:
- `http://localhost:3000/` (Home)
- `http://localhost:3000/supplier` (Fornecedor)
- `http://localhost:3000/admin` (Equipe)

## PDF

Para gerar PDF do calendário mensal:

```
GET /api/pdf?month=YYYY-MM&scope=team|supplier&supplierId=...
```

## Scripts

- `npm run dev` - ambiente local
- `npm run build` - build produção
- `npm run seed` - seed fornecedores
