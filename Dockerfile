# 建構階段
FROM node:20 AS builder

WORKDIR /app

COPY src/frontend/ ./

RUN npm install -g pnpm \
    && pnpm install \
    && pnpm run build

# 部署階段
FROM nginx:alpine

COPY --from=builder /app/out /usr/share/nginx/html

EXPOSE 80
CMD ["nginx", "-g", "daemon off;"]
