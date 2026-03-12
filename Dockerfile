FROM node:22-alpine AS builder

WORKDIR /app

# Install git for sync-wiki script
RUN apk add --no-cache git

COPY package.json yarn.lock ./
RUN yarn install --frozen-lockfile

COPY . .
RUN yarn build

# Create index.html for the SPA
RUN printf '<!DOCTYPE html>\n\
<html lang="en">\n\
<head>\n\
  <meta charset="UTF-8">\n\
  <meta name="viewport" content="width=device-width, initial-scale=1.0">\n\
  <title>Teras - BlankOn</title>\n\
  <link rel="icon" href="/favicon.ico">\n\
  <link rel="manifest" href="/manifest.json">\n\
  <meta name="description" content="Teras - BlankOn Website">\n\
</head>\n\
<body>\n\
  <div id="root"></div>\n\
  <script type="module" src="/assets/main-_xEiGKjZ.js"></script>\n\
</body>\n\
</html>\n' > /app/dist/client/index.html

FROM nginx:alpine

# Copy static files from builder
COPY --from=builder /app/dist/client /usr/share/nginx/html

# Create nginx config for SPA (redirect all routes to index.html)
RUN printf 'server {\n\
    listen 80;\n\
    server_name _;\n\
    root /usr/share/nginx/html;\n\
    index index.html;\n\
\n\
    location / {\n\
        try_files $uri $uri/ /index.html;\n\
    }\n\
\n\
    # Cache static assets\n\
    location ~* \.(?:css|js|jpg|jpeg|gif|png|ico|svg|woff|woff2|ttf|eot)$ {\n\
        expires 1y;\n\
        add_header Cache-Control "public, immutable";\n\
    }\n\
}\n' > /etc/nginx/conf.d/default.conf

EXPOSE 80

CMD ["nginx", "-g", "daemon off;"]
