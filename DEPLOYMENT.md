# Deployment Guide - InnoPulse 360

## 1) Database (Railway or Supabase)
1. Create a PostgreSQL instance.
2. Copy connection string into `server/.env` as `DATABASE_URL`.

## 2) Backend Deploy (Railway)
1. Create Railway service from `/server`.
2. Set variables from `server/.env.example`.
3. Build command: `npm install && npm run build`.
4. Start command: `npm run start`.
5. Run once after deploy: `npm run db:push && npm run db:seed`.

Example API URL format:
`https://innopulse360-api.up.railway.app`

## 3) Frontend Deploy (Vercel)
1. Import repository in Vercel with root `client`.
2. Add env vars from `client/.env.example`.
3. Set `NEXT_PUBLIC_API_URL` to Railway backend `/api` URL.
4. Deploy.

Final frontend URL format:
`https://innopulse360.vercel.app`

## 4) Security Checklist
- Set strong JWT secrets.
- Use production SMTP credentials.
- Keep `secure` cookies enabled in production.
- Restrict CORS origin to the Vercel domain.
- Enable Railway private networking if possible.
