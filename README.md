# LMS (React + Express + MySQL + Knex)

## Backend
1. `cd backend`
2. `npm install`
3. Copy `.env.example` to `.env`
4. `npm run migrate`
5. `npm run dev`

## Frontend
1. `cd frontend`
2. `npm install`
3. Copy `.env.example` to `.env`
4. `npm run dev`

## Notes
- Aiven MySQL SSL is enabled via `DB_SSL=true`.
- Refresh token is HTTP-only cookie; access token is bearer token.
- Video locking/ordering is enforced server-side in `backend/src/utils/ordering.js`.
- For Render + Vercel, set backend env:
  - `CORS_ORIGIN=https://your-frontend.vercel.app`
  - `ALLOW_VERCEL_ORIGINS=true`
  - `COOKIE_DOMAIN=` (empty unless you use a shared custom domain)
