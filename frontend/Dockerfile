# Stage 1: build Angular application
FROM node:20-alpine AS build
WORKDIR /app

COPY package*.json ./
COPY angular.json tsconfig*.json ./
COPY src ./src
RUN npm install && npm run build:prod

# Stage 2: serve static bundle via nginx with API proxy
FROM nginx:1.25-alpine AS runtime
COPY nginx.conf /etc/nginx/conf.d/default.conf
COPY --from=build /app/dist/draftgame-frontend/browser /usr/share/nginx/html
EXPOSE 8080
CMD ["nginx", "-g", "daemon off;"]
