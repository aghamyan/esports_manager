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
│   ├── public/
│   ├── src/
│   │   ├── pages/
│   │   ├── App.jsx
│   │   ├── main.jsx
│   │   └── styles.css
│   ├── .env.example
│   ├── index.html
│   ├── package.json
│   └── vite.config.js
├── server/                 # Express REST API + Prisma
│   ├── prisma/
│   │   └── schema.prisma
│   ├── src/
│   │   ├── config/
│   │   ├── controllers/
│   │   ├── middleware/
│   │   ├── routes/
│   │   └── index.js
│   ├── .env.example
│   └── package.json
├── .gitignore
├── package.json            # Root helper scripts
└── README.md
```

## What each main folder does

- `client/`: frontend website. Handles navigation and UI pages for players, matches, and tournaments.
- `server/`: backend REST API. Handles requests, validation, error handling, and database operations.
- `server/prisma/`: Prisma schema and database modeling.

## Localhost setup (exact steps)

### 1) Prerequisites

- Node.js 18+
- npm 9+
- PostgreSQL running locally

### 2) Create database

In PostgreSQL, create a database called `fc26_manager` (or choose your own name).

Example SQL:

```sql
CREATE DATABASE fc26_manager;
```

### 3) Install dependencies

From project root:

```bash
npm install
npm run install:all
```

### 4) Create environment files

Copy environment templates:

```bash
cp server/.env.example server/.env
cp client/.env.example client/.env
```

Then update `server/.env` with your real PostgreSQL credentials:

```env
PORT=5000
DATABASE_URL="postgresql://postgres:postgres@localhost:5432/fc26_manager?schema=public"
```

Optional frontend env:

```env
VITE_PORT=5173
VITE_API_URL=http://localhost:5000
```

### 5) Initialize Prisma

From project root:

```bash
npm run prisma:generate --prefix server
npm run prisma:migrate --prefix server -- --name init
```

### 6) Run both client and server

From project root:

```bash
npm run dev
```

- Frontend: `http://localhost:5173`
- Backend: `http://localhost:5000`
- Health check: `http://localhost:5000/health`

## REST API endpoints (starter)

- `GET /health`
- `GET /api/players`
- `POST /api/players`
- `GET /api/tournaments`
- `POST /api/tournaments`
- `GET /api/matches`
- `POST /api/matches`

## Notes

- Authentication is intentionally **not implemented yet**.
- Deployment is intentionally **not implemented yet**.
- UI is intentionally minimal and beginner-friendly.
