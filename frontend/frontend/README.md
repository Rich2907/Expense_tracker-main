# Expense Tracker Frontend

React (JavaScript) + Vite frontend for the Spring Boot expense-tracker API.
Screens: Dashboard, Expenses, Categories, Users.

## Prerequisites
- Node.js 18+ and npm
- Java and Maven/Gradle (whatever your Spring Boot backend uses), plus its database

## 1. Start the backend
From the backend project root (adjust to your build tool):

```bash
./mvnw spring-boot:run     # Maven
./gradlew bootRun          # Gradle
```

It must be listening on http://localhost:8080. The controllers allow CORS from
`http://localhost:5173`, so the frontend dev server is pinned to that port.

## 2. Start the frontend
```bash
cd frontend
npm install
npm run dev
```
Open http://localhost:5173. Production build: `npm run build` (output in `dist/`).

## Configuration
Copy `.env.example` to `.env` to override (both optional):

| Variable | Default | Purpose |
| --- | --- | --- |
| `VITE_API_BASE_URL` | `http://localhost:8080` | Backend base URL (read once in `src/api.js`) |
| `VITE_CURRENCY` | `USD` | ISO 4217 code used to format amounts (e.g. `INR`, `EUR`) |

Restart `npm run dev` after changing `.env`. If you serve the frontend from another
origin, the backend's CORS configuration must allow it.

## Notes
- Editing an expense changes only amount and description; the backend ignores user/category on update, so the UI shows them read-only.
- Deleting a category (or user) that expenses still reference is rejected by the backend. The error is shown with a reminder to delete those expenses first.
- The backend returns no dates, so "recent" expenses means the highest IDs.
