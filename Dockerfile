FROM node:22-alpine AS builder

WORKDIR /app

# Install git for sync-wiki script
RUN apk add --no-cache git

COPY package.json yarn.lock ./
RUN yarn install --frozen-lockfile

COPY . .
RUN yarn build

FROM node:22-alpine

WORKDIR /app

RUN npm install -g wrangler

COPY --from=builder /app/dist ./dist
COPY --from=builder /app/package.json ./
COPY --from=builder /app/wrangler.jsonc ./

EXPOSE 3000

WORKDIR /app/dist/server

CMD ["wrangler", "dev", "--port", "3000", "--ip", "0.0.0.0"]
