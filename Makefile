.PHONY: dev dev-api dev-web build up down logs ps seed setup-minio

# Development
dev:
	concurrently "make dev-api" "make dev-web"

dev-api:
	cd api && npm run dev

dev-web:
	cd web && npm run dev

# Generate lock files (required before Docker build)
lock:
	cd api && npm install
	cd web && npm install

# Docker
up:
	docker compose up -d

down:
	docker compose down

logs:
	docker compose logs -f

ps:
	docker compose ps

# Reset everything (removes volumes)
reset:
	docker compose down -v

# MinIO bucket setup (run after docker compose up)
setup-minio:
	docker exec illustrates_minio mc alias set local http://localhost:9000 minioadmin minioadmin
	docker exec illustrates_minio mc mb --ignore-existing local/portfolio
	docker exec illustrates_minio mc anonymous set download local/portfolio/cv/
	@echo "MinIO ready. Upload CV at http://localhost:9001"

# Seed database
seed:
	cd api && npm run seed

# Type check both projects
typecheck:
	cd api && npm run type-check
	cd web && npx tsc --noEmit
