<<<<<<< HEAD
Illustrated.dev
=======
# illustrates.dev

Full-stack portfolio platform — Express API + Next.js in a single monorepo.

## Structure

```
illustrates-dev/
├── api/                     Express + TypeScript backend
│   └── src/
│       ├── api/v1/          Routes: projects, blog, discussions, users, stats, support
│       ├── jobs/workers/    BullMQ workers: email, file processor, notification
│       ├── lib/             DB, Redis, MinIO, metrics, logger
│       ├── middleware/       Auth (Clerk), rate limiter, validation, error handler
│       └── webhooks/        Clerk user sync webhook
│
├── web/                     Next.js 15 frontend
│   └── src/
│       ├── app/             Pages: /, /projects, /blog, /discussions, /support,
│       │                          /about, /admin/*, /dashboard/*
│       ├── components/
│       │   ├── ui/          Button, Input, Badge, EmptyState
│       │   └── features/    projects/, blog/, discussions/, support/
│       ├── lib/
│       │   ├── api/         client.ts, server.ts, projects.ts, posts.ts
│       │   ├── hooks/       useProjects, usePosts, useDiscussions, useAnalytics, useUsers
│       │   └── store/       Zustand: ui.store, project.store, auth.store
│       └── types/           api.ts — shared types
│
├── infra/
│   ├── nginx/nginx.conf     Production reverse proxy
│   ├── prometheus/          Metrics scraping config
│   └── mongo/init.js        DB init + indexes
│
├── docker-compose.yml       Full stack (api, web, mongo, redis, minio, nginx, prometheus, grafana)
├── .env.example             All env vars documented
└── README.md
```

## Quick start

```bash
cp .env.example .env
# Required: CLERK_SECRET_KEY, NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY, CLERK_WEBHOOK_SECRET

docker-compose up -d
```

| Service    | URL                   |
|------------|-----------------------|
| App        | http://localhost      |
| API        | http://localhost/api/v1/health |
| Grafana    | http://localhost:3001 |
| MinIO      | http://localhost:9001 |
| Prometheus | http://localhost:9090 |

## Admin setup

1. Sign up at /signup
2. Clerk Dashboard → Users → your account → Public metadata → `{ "role": "admin" }`
3. Sign out + back in → visit /admin

## Production (DigitalOcean)

```bash
# 1. Create Droplet (Ubuntu 22, 4GB RAM min)
# 2. Install Docker
curl -fsSL https://get.docker.com | sh

# 3. Clone repo + configure
git clone https://github.com/you/illustrates-dev
cd illustrates-dev
cp .env.example .env   # fill in production values

# 4. Add SSL certs
mkdir infra/nginx/ssl
# certbot or DigitalOcean managed SSL

# 5. Start
docker-compose up -d

# 6. Set up MinIO bucket
docker exec -it illustrates_minio mc alias set local http://localhost:9000 $STORAGE_ACCESS_KEY $STORAGE_SECRET_KEY
docker exec -it illustrates_minio mc mb local/portfolio
docker exec -it illustrates_minio mc anonymous set download local/portfolio/cv/
```
>>>>>>> 9aef663 (Uploading beta/v2 platform)


<!-- triggering deploy action after final fix -->