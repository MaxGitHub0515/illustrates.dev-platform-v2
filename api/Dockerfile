FROM node:20-alpine AS builder
WORKDIR /app
RUN apk add --no-cache curl
COPY package*.json ./
RUN npm install --legacy-peer-deps
COPY . .
RUN npm run build

FROM node:20-alpine AS runner
WORKDIR /app
ENV NODE_ENV=production
RUN apk add --no-cache curl
COPY package*.json ./
RUN npm install --omit=dev --legacy-peer-deps && npm cache clean --force
COPY --from=builder /app/dist ./dist
RUN mkdir -p logs
EXPOSE 5001
CMD ["node", "dist/server.js"]
