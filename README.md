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
├── docker-compose.yml      # PostgreSQL for local development
└── README.md
```

## Prerequisites

- [Node.js](https://nodejs.org/) 20+
- [.NET SDK](https://dotnet.microsoft.com/download) 9
- [Docker Desktop](https://www.docker.com/products/docker-desktop/) (recommended for PostgreSQL)

## PostgreSQL (development)

**Recommended: Docker (Option B)** — free, isolated, and easy to reset. No system-wide PostgreSQL install required.

```bash
docker compose up -d
```

Connection string (already in `appsettings.Development.json`):

```
Host=localhost;Port=5432;Database=chefmate;Username=chefmate;Password=chefmate_dev
```

**Option A — local install:** Install PostgreSQL from [postgresql.org](https://www.postgresql.org/download/) and create a matching database/user, then update the connection string.

## Getting started

### Backend

```bash
cd server/Chefmate.API
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
