# CivicPulse AI Backend - Vercel Deployment Guide

This guide walks through deploying the CivicPulse AI backend (Node.js + Express.js + TypeScript + MongoDB Atlas) on **Vercel Serverless Functions**.

## 1. Project structure (Vercel-ready)

```
backend-ai/
├── api/
│   └── index.ts              # Vercel serverless entry point (Express handler)
├── src/
│   ├── app.ts                # Express app factory (no app.listen, no DB connect)
│   ├── server.ts             # Local dev server (app.listen only)
│   ├── config/
│   │   ├── index.ts          # Env config + validation
│   │   ├── db.ts             # Cached Mongoose connection (serverless-safe)
│   │   └── cloudinary.ts     # Cloudinary config
│   ├── routes/               # All API routes (mounted under /api)
│   ├── controllers/
│   ├── models/
│   ├── services/
│   ├── middleware/
│   ├── validations/
│   ├── ai/
│   └── seeders/
│       └── adminSeeder.ts    # Exported seedAdmin (one-time, NOT auto-run)
├── vercel.json               # Vercel config (rewrites + build command)
├── .env.example              # Variable names only (no values)
├── .gitignore                # Excludes all .env* files
├── package.json
└── tsconfig.json
```

## 2. Required Vercel environment variables

Set these in **Vercel Dashboard → Project Settings → Environment Variables** (Production). Never hardcode them.

| Variable | Description | Example |
|---|---|---|
| `MONGODB_URI` | MongoDB Atlas connection string | `mongodb+srv://<user>:<pass>@cluster.mongodb.net/civicpulse-ai?retryWrites=true&w=majority` |
| `JWT_SECRET` | JWT signing secret (32+ chars in prod) | `...` |
| `JWT_EXPIRES_IN` | JWT expiry | `15m` |
| `REFRESH_TOKEN_SECRET` | Refresh token secret (32+ chars) | `...` |
| `REFRESH_TOKEN_EXPIRES_IN` | Refresh token expiry | `7d` |
| `GEMINI_API_KEY` | Google Gemini API key | `...` |
| `CLOUDINARY_CLOUD_NAME` | Cloudinary cloud name | `...` |
| `CLOUDINARY_API_KEY` | Cloudinary API key | `...` |
| `CLOUDINARY_API_SECRET` | Cloudinary API secret | `...` |
| `ADMIN_EMAIL` | Admin seed email | `admin@yourdomain.com` |
| `ADMIN_PASSWORD` | Admin seed password (12+ chars in prod) | `...` |
| `FRONTEND_URL` | Allowed CORS origin(s), comma-separated | `https://your-frontend.vercel.app` |
| `NODE_ENV` | `production` | `production` |
| `PORT` | (ignored on Vercel; used locally) | `5000` |
| `LOG_LEVEL` / `LOG_PRETTY` | Logging | `info` / `false` |

## 3. MongoDB Atlas configuration

1. Create a MongoDB Atlas cluster and a database user with read/write access.
2. **Network Access → Add IP Address**: Because Vercel is serverless and invocations come from changing IPs, add `0.0.0.0/0` (allow all) or add the Vercel egress IPs for your region. `0.0.0.0/0` is simplest and works with strong username/password auth.
3. Get the connection string (Drivers → Node.js) and set it as `MONGODB_URI` in Vercel.
4. The app uses a cached Mongoose connection (`src/config/db.ts`) keyed on `globalThis`, so warm serverless containers reuse the connection and cold starts create one connection only.

## 4. Import the repository to Vercel

1. Push the backend code to GitHub.
2. In Vercel: **Add New Project → Import Git Repository → select `civicpulse-ai/backend-ai`**.
3. Configure the project:
   - **Root Directory**: `backend-ai` (if the backend is a subfolder of a monorepo) or `.` if this repo is the backend itself.
   - **Framework Preset**: `None`.
   - **Build Command**: `tsc` (defined in `vercel.json`).
   - **Install Command**: `npm install`.
   - **Output Directory**: leave blank (this is a serverless-functions project, not a static build).
   - **Development Command**: `npm run dev` (optional).
4. Add all environment variables from section 2.
5. Click **Deploy**.

Vercel routes every request under `/api` to `api/index.ts` via the rewrite in `vercel.json`.

## 5. API endpoints (all under `/api`)

| Method | Endpoint | Auth |
|---|---|---|
| GET | `/api/health` | No |
| POST | `/api/auth/register` | No |
| POST | `/api/auth/login` | No |
| GET | `/api/auth/me` | Yes |
| POST | `/api/auth/logout` | Yes |
| GET | `/api/reports` | No |
| GET | `/api/reports/my-reports` | Yes |
| GET | `/api/reports/nearby` | No |
| GET | `/api/reports/:id` | No |
| POST | `/api/reports` | Yes |
| PATCH | `/api/reports/:id` | Yes |
| DELETE | `/api/reports/:id` | Yes |
| POST | `/api/uploads/images` | Yes (multipart, max 5 files × 5MB) |
| DELETE | `/api/uploads/images` | Yes |
| POST | `/api/ai/analyze-image` | Yes |
| POST | `/api/duplicates/check` | Yes |
| GET | `/api/analytics/summary` | Yes |
| GET | `/api/notifications` | Yes |
| GET | `/api/notifications/unread-count` | Yes |
| PATCH | `/api/notifications/:id/read` | Yes |
| GET | `/api/notifications/activity/:reportId` | Yes |

The health-check endpoint `GET /api/health` reports database readiness (`200` when connected, `503` when degraded).

## 6. CORS configuration

Set `FRONTEND_URL` to your deployed frontend origin (comma-separated for multiple, no trailing slashes). The CORS middleware (`src/app.ts`) allows those origins with `credentials: true` and the standard methods/headers. Non-browser requests (no `Origin` header) are also allowed.

Example: `FRONTEND_URL=https://civicpulse-ai.vercel.app,http://localhost:3000`

## 7. Admin seeding (one-time, safe)

`src/seeders/adminSeeder.ts` exports `seedAdmin()` and does **not** self-execute. It is **not** invoked on any serverless request.

- It checks whether an admin with `ADMIN_EMAIL` already exists and **skips** if so — the existing admin password is never reset.
- To create the admin once after deployment, run locally with the production env loaded:

```
npm run seed
```

(`npm run seed` runs `tsx src/seeders/adminSeeder.ts`.)

Run this exactly once (e.g., from your local machine with `vercel env pull` variables, or via a one-off task). Do not add it to a request path or a cron.

## 8. File uploads to Cloudinary (serverless limits)

- Uploads use `multer.memoryStorage()` — **no local filesystem** is used (safe for serverless).
- Files are streamed from memory buffers directly to Cloudinary (`src/controllers/uploadController.ts`).
- Limit: max 5 files per request, 5 MB each.
- Vercel Hobby tier request body limit is ~4.5 MB total; keep individual/total upload sizes within your plan's limit. For larger uploads, upgrade to Vercel Pro or have clients upload directly to Cloudinary from the frontend (signed uploads).
- No local file persistence anywhere in the codebase.

## 9. TypeScript checks and production build

```bash
# Type-check
npx tsc --noEmit

# Production build (emits to dist/)
npm run build        # tsc
```

The Vercel build command is `tsc`. `tsc` type-checks `src/`; `api/index.ts` is bundled by Vercel's esbuild at deploy time.

## 10. Production API testing

```bash
# Health check
curl https://<your-vercel-app>.vercel.app/api/health

# Register
curl -X POST https://<your-vercel-app>.vercel.app/api/auth/register \
  -H "Content-Type: application/json" \
  -d '{"name":"Test","email":"test@example.com","password":"password123"}'

# Login
curl -X POST https://<your-vercel-app>.vercel.app/api/auth/login \
  -H "Content-Type: application/json" \
  -d '{"email":"test@example.com","password":"password123"}'
```

Check request/logs in the Vercel Dashboard. Errors are logged via Winston without exposing secrets.

## 11. Known Vercel serverless limitations and solutions

| Limitation | Recommended solution |
|---|---|
| 10s invocation timeout (Hobby tier) | Gemini AI calls with retry/20s timeouts may exceed it. Upgrade to Vercel Pro (longer timeouts) or move heavy AI work to background jobs / direct client-to-Gemini calls. |
| Cold starts | First request after inactivity connects to MongoDB (~1-3s). Acceptable; cached connection speeds warm requests. |
| No local filesystem | All storage is remote (MongoDB Atlas, Cloudinary). No `fs` writes. |
| Rate limiting is per-instance | `express-rate-limit` uses in-memory store; in serverless each container has its own store. For strict global limits, use Redis-based rate limiting. |
| Request body size (~4.5 MB Hobby) | Keep multipart uploads small; use direct Cloudinary uploads for large files. |
| `process.exit` on config errors | `validateEnv()` fails fast on missing/weak production env vars. Ensure all variables are set in Vercel before deploying. |

## 12. Files changed / created

**Created:** `api/index.ts`, `src/app.ts`, `vercel.json`, `.env.example` (rewritten), `DEPLOYMENT.md`
**Modified:** `src/server.ts`, `src/config/db.ts`, `src/config/index.ts`, `.gitignore`, `src/seeders/adminSeeder.ts`, `.env`
