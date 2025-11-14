# Game Advisor System

Full-stack platform for managing curated game articles, user profiles, and live game metadata powered by the RAWG API. The project exposes an Express + MongoDB backend and a React front-end with JWT authentication, advanced search, comparison tools, and an admin dashboard.

## Prerequisites

- Node.js 18+
- npm
- MongoDB instance (local or remote)
- RAWG developer API key

## Environment variables

Create `.env` files in both `server/` and `client/` (optional) folders. Backend requires:

```bash
# server/.env
PORT=4000
MONGODB_URI=mongodb://localhost:27017/game-advisor
JWT_SECRET=super-secret-key
RAWG_API_KEY=19e6fa0eebc84db38c33877a24f58726
```

The React app reads API URL from `VITE_API_BASE_URL` (defaults to `/api`). Example:

```bash
# client/.env
VITE_API_BASE_URL=/api
```

## Backend

```bash
cd server
npm install
npm run dev
```

The API listens on `http://localhost:4000`. Major route groups:

- `POST /api/auth/register`, `POST /api/auth/login`, `GET /api/auth/me`
- `GET /api/articles`, `GET /api/articles/:slug`, editor/admin CRUD
- RAWG proxy endpoints under `/api/games`
- Recommendations `/api/recommend/games/:userId`
- Comments and local ratings under `/api/comments` and `/api/ratings`
- Admin panel under `/api/admin` (protected by JWT + role)

## Frontend

```bash
cd client
npm install
npm run dev
```

The Vite dev server starts on `http://localhost:3000` and proxies `/api` to the backend. Pages include:

- Home with paginated game articles
- Article detail with RAWG data, related posts, comments, and markdown rendering
- Game explorer, game detail (with local ratings + comments), advanced search, comparison
- Authentication (register/login) and user profile with favourites/history
- Admin dashboard for managing users, articles, and comments

## RAWG API usage

All RAWG requests are proxied via the backend service located at `server/src/services/rawgService.js`. The proxy attaches `key=${process.env.RAWG_API_KEY}` automatically and applies a 10-minute in-memory cache to reduce API calls.

## Scripts

- `npm run dev` – hot-reload development server (backend or frontend depending on directory)
- `npm run start` – production start command for the backend

## Testing the stack

1. Start MongoDB (e.g. `mongod` locally or Atlas cluster).
2. Run the backend dev server (`npm run dev` inside `server/`).
3. Launch the frontend dev server (`npm run dev` inside `client/`).
4. Visit `http://localhost:3000` to interact with the Game Advisor UI.

## Project structure

```
.
├── client/         # React application (Vite)
│   ├── src/
│   │   ├── App.jsx
│   │   ├── context/AuthContext.jsx
│   │   ├── components/
│   │   ├── pages/
│   │   └── services/
│   └── vite.config.js
└── server/         # Express REST API
    ├── src/
    │   ├── app.js
    │   ├── index.js
    │   ├── config/
    │   ├── controllers/
    │   ├── middlewares/
    │   ├── models/
    │   ├── routes/
    │   └── services/
    └── package.json
```
