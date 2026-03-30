# fc26-manager

Full-stack JavaScript project for local FC26 competition management.

## Tech stack

- **Frontend:** React + Vite (JavaScript)
- **Backend:** Node.js + Express
- **Database:** PostgreSQL
- **ORM:** Prisma

## Project structure

```text
fc26-manager/
├── client/                 # React frontend (Vite)
│   ├── src/
│   │   ├── pages/
│   │   ├── App.jsx
│   │   ├── main.jsx
│   │   └── styles.css
│   ├── index.html
│   ├── package.json
│   └── vite.config.js
├── server/                 # Express REST API + Prisma
│   ├── prisma/
│   │   ├── migrations/
│   │   └── schema.prisma
│   ├── src/
│   │   ├── config/
│   │   ├── controllers/
│   │   ├── middleware/
│   │   ├── routes/
│   │   └── index.js
│   └── package.json
├── .gitignore
├── package.json            # Root helper scripts
└── README.md
```

## Local setup

### 1) Prerequisites

- Node.js 18+
- npm 9+
- PostgreSQL running locally

### 2) Create the database

```sql
CREATE DATABASE fc26_manager;
```

### 3) Install dependencies

From project root:

```bash
npm install
npm run install:all
```

### 4) Configure environment variables

Create `server/.env` (exact example):

```env
# Backend port (use 5001 if 5000 is busy)
PORT=5000

# React app origin allowed by CORS
CORS_ORIGIN=http://localhost:5173

# PostgreSQL connection used by Prisma
DATABASE_URL="postgresql://postgres:postgres@localhost:5432/fc26_manager?schema=public"
```

Optional `client/.env`:

```env
VITE_PORT=5173
VITE_API_URL=http://localhost:5000
```

## Player CRUD setup and usage

### Prisma datasource config (exact)

`server/prisma/schema.prisma`:

```prisma
datasource db {
  provider = "postgresql"
  url      = env("DATABASE_URL")
}
```

### Commands (exact)

Create the database:

```bash
psql -U postgres -h localhost -c "CREATE DATABASE fc26_manager;"
```

Run Prisma migration:

```bash
npm run prisma:migrate --prefix server -- --name init
```

If needed, generate Prisma client:

```bash
npm run prisma:generate --prefix server
```

### Start backend (exact)

```bash
npm run dev:server
```

Backend runs at `http://localhost:5000`.
If port `5000` is in use, set `PORT=5001` in `server/.env` and restart.

### Start frontend (exact)

```bash
npm run dev:client
```

Frontend runs at `http://localhost:5173`.

### How frontend talks to backend

- `client/src/pages/PlayersPage.jsx` calls the backend with `fetch`.
- Base URL is `VITE_API_URL` (or defaults to `http://localhost:5000`).
- Endpoints used by the page:
  - `GET /api/players` (list)
  - `POST /api/players` (create)
  - `PUT /api/players/:id` (update)
  - `DELETE /api/players/:id` (delete)

### Health routes

- `GET /api/health` (backend status)
- `GET /api/health/db` (simple PostgreSQL connectivity check)

## API endpoints

- `GET /api/health`
- `GET /api/health/db`
- `GET /api/players`
- `GET /api/players/:id`
- `POST /api/players`
- `PUT /api/players/:id`
- `DELETE /api/players/:id`
- `GET /api/tournaments`
- `POST /api/tournaments`
- `GET /api/matches`
- `POST /api/matches`

## Player payload

```json
{
  "fullName": "Kylian Mbappé",
  "nickname": "KM7",
  "psnId": "kmbappe_psn"
}
```

Validation rules:
- `fullName` is required.
- `nickname` is required and must be unique.
- `psnId` is optional.
