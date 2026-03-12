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

COPY --from=builder /app/.output ./.output
COPY --from=builder /app/package.json ./

EXPOSE 3000

CMD ["wrangler", "pages", "dev", ".output/public", "--port", "3000"]
