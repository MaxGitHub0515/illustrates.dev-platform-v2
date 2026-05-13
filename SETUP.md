# Setup Guide — illustrates.dev

## Quick start (local dev)

```bash
# 1. Configure environment
cp web/.env.local.example  web/.env.local    # fill in Clerk keys
cp api/.env.example        api/.env          # fill in Clerk keys + MongoDB URI

# 2. Start backend (Terminal 1)
cd api && npm install && npm run dev
# → http://localhost:5001

# 3. Start frontend (Terminal 2)
cd web && npm install && npm run dev
# → http://localhost:3000
```

## Common errors and fixes

### "Invalid or expired token" in admin Users/Discussions/Analytics

**Cause:** The backend can't verify your Clerk session token.

**Fix:** Make sure `api/.env` has `CLERK_SECRET_KEY` matching your Clerk app:
1. Go to [dashboard.clerk.com](https://dashboard.clerk.com)
2. Select your app → **API Keys**
3. Copy the **Secret key** (starts with `sk_test_` or `sk_live_`)
4. Add to `api/.env`: `CLERK_SECRET_KEY=sk_test_...`
5. Restart the backend: `cd api && npm run dev`

### Admin dashboard shows 403 / Access restricted

**Fix:** Set your user's role to `admin` in Clerk Dashboard:
1. dashboard.clerk.com → **Users** → click your account
2. **Public metadata** → Edit → paste: `{ "role": "admin" }` → Save
3. Sign out and back in on the site

### Projects/Posts/Stats all show 0 or error

**Fix:** The frontend needs to know the backend URL:
1. Add `NEXT_PUBLIC_API_URL=http://localhost:5001/api/v1` to `web/.env.local`
2. Restart the frontend: `cd web && npm run dev`

### "Cannot connect to MongoDB"

**Fix:** Make sure MongoDB is running:
```bash
# With Docker:
docker run -d -p 27017:27017 mongo:7.0

# Or via Docker Compose (starts everything):
docker compose up -d
```
Then set `MONGODB_URI=mongodb://localhost:27017/portfolio` in `api/.env`

---

## Enable social login (Google, GitHub, Discord)

Clerk Dashboard → **Configure** → **Social Connections** → toggle ON each provider

## Enable phone verification (not supported in Poland)

Clerk uses a third-party SMS provider with limited country support.
**Workaround:** Use email OTP instead:
Clerk Dashboard → **User & Authentication** → **Phone number** → set to **Optional** or **Off**

## Production (DigitalOcean)

```bash
git clone <your-repo> illustrates-dev
cd illustrates-dev
cp .env.example .env      # fill in production values
docker compose build
docker compose up -d
```

## Why `printenv | grep NEXT_PUBLIC` shows nothing inside the container

This is **expected behaviour** — not a bug.

`NEXT_PUBLIC_*` variables are embedded into the JavaScript bundle at **build time** by Next.js webpack. After building, they don't exist as runtime environment variables; they're compiled strings inside the JS files. Running `printenv` inside the running container won't find them.

**How to verify they were baked in correctly:**
```bash
# Check the built JS contains your API URL:
docker exec illustrates_web grep -r "localhost/api/v1" /app/.next/static 2>/dev/null | head -3

# Or check the page source in your browser:
# Right-click → View Page Source → search for NEXT_PUBLIC_API_URL
```

**Build order — always rebuild after changing .env:**
```bash
docker compose down
docker compose build --no-cache web
docker compose up -d
```
