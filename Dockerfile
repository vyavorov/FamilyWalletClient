# Билд стейдж
FROM node:20-alpine as build

WORKDIR /app

COPY package*.json ./
RUN npm install

COPY . .
RUN npm run build

# Продакшън стейдж (с nginx)
FROM nginx:stable-alpine

COPY --from=build /app/build /usr/share/nginx/html

# Копирай custom nginx конфигурация ако е нужно:
# COPY nginx.conf /etc/nginx/nginx.conf

EXPOSE 80

CMD ["nginx", "-g", "daemon off;"]