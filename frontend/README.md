# Frontend (React + TypeScript + Tailwind)

The frontend is a multi-page UI for accommodation operations.

## Stack

- React 18
- TypeScript
- Tailwind CSS
- Framer Motion
- Vite

## Features in UI

- Login page with role-based access.
- Session persistence with backend token auth.
- Role-aware controls in CRUD views.
- Light/dark mode toggle.
- Report runner and pulse metrics dashboards.

## Install

```bash
# from repository root
cd frontend
npm install
```

## Run in development

```bash
npm run dev
```

Frontend runs on `http://localhost:5173`.

Vite proxy forwards:

- `/api` -> `http://localhost:8000`
- `/health` -> `http://localhost:8000`

Important:

- Backend auth endpoints are under `/auth/*` and are called directly from frontend.
- Keep backend running on port `8000` unless you also update frontend API base configuration.

## Login demo users

- `admin` / `Admin@123`
- `manager` / `Manager@123`
- `viewer` / `Viewer@123`

## Build for production

```bash
npm run build
```

Output is generated in `frontend/dist/`.

The backend serves these built files at `GET /` and `/assets/*`.

## Preview build locally

```bash
npm run preview
```

## Useful files

- Routes and guards: `frontend/src/App.tsx`
- Login page: `frontend/src/pages/LoginPage.tsx`
- Auth provider: `frontend/src/providers/AuthProvider.tsx`
- Theme provider: `frontend/src/providers/ThemeProvider.tsx`
- API helper: `frontend/src/lib/api.ts`
