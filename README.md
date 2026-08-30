# ChefMate AI

Full-stack recipe assistant with a React frontend and ASP.NET Core API backed by PostgreSQL.

## Project structure

```
chefmate-ai/
├── client/                 # React + TypeScript (Vite)
├── server/
│   └── ChefMate.API/       # ASP.NET Core Web API
│       ├── Controllers/
│       ├── Data/
│       ├── Models/
│       ├── DTOs/
│       ├── Services/
│       └── Program.cs
└── README.md
```

## Prerequisites

- [Node.js](https://nodejs.org/) 20+
- [.NET SDK](https://dotnet.microsoft.com/download) 9
- A [Neon](https://neon.tech) PostgreSQL database (free tier)

## PostgreSQL

This project uses **Neon** (hosted PostgreSQL). No Docker or local Postgres install is required.

Database password and JWT signing key are **not** stored in `appsettings.json`. Copy `.env.example` to `.env` in the repo root and fill in:

- `ConnectionStrings__DefaultConnection` — Neon connection string (includes the password)
- `Jwt__Key` — at least 32 characters
- `Gemini__ApiKey` — Google Gemini API key for pantry image scanning

`.env` is gitignored. You can also set the same names as real environment variables; those win over `.env`.

## Getting started

### Backend

```bash
cp .env.example .env
# edit .env with your Neon connection string and JWT key

cd server/ChefMate.API
dotnet restore
dotnet run
```

API runs at `https://localhost:7xxx` (see launch settings).

### Frontend

```bash
cd client
npm install
npm run dev
```

App runs at `http://localhost:5173`.

## Installed backend packages

- Microsoft.EntityFrameworkCore
- Microsoft.EntityFrameworkCore.Design
- Npgsql.EntityFrameworkCore.PostgreSQL
- Microsoft.AspNetCore.Identity.EntityFrameworkCore
- Microsoft.AspNetCore.Authentication.JwtBearer
- FluentValidation.AspNetCore
