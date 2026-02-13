# InnoPulse 360

Measure Innovation. Monitor Process. Maximize Impact.

AI-driven hackathon and innovation event process performance monitoring platform.

## Apps
- `client`: Next.js 14 + TypeScript + Tailwind + ShadCN + Recharts
- `server`: Express + TypeScript + Prisma + PostgreSQL + JWT + RBAC + OTP

## Quick Start
1. Install dependencies: `npm install`
2. Copy env files:
   - `copy server/.env.example server/.env`
   - `copy client/.env.example client/.env.local`
3. Start PostgreSQL and set `DATABASE_URL`
4. Push schema: `npm run db:push`
5. Seed data: `npm run db:seed`
6. Run both apps: `npm run dev`

## Auth + Seed Credentials
- Admin: `admin@innopulse360.com` / `Admin@123`
- Participant: `participant@innopulse360.com` / `User@1234`

## API Highlights
- `POST /api/auth/register`
- `POST /api/auth/verify-otp`
- `POST /api/auth/login`
- `POST /api/auth/refresh`
- `GET /api/dashboard/participant` (RBAC: PARTICIPANT)
- `GET /api/dashboard/admin` (RBAC: ADMIN)
- `PATCH /api/admin/users/:userId/approval` (RBAC: ADMIN)
- `GET /api/admin/reports/export?format=csv|pdf` (RBAC: ADMIN)

## Production URLs
- Frontend: `https://innopulse360.vercel.app`
- Backend (example Railway): `https://innopulse360-api.up.railway.app`
