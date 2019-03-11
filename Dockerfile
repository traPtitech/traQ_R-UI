# ビルド環境
FROM node:10.10.0-alpine as build
WORKDIR /app
RUN apk add --no-cache git
RUN apk add --no-cache gzip
COPY package*.json ./
RUN npm ci
COPY . .
RUN npm run build
RUN gzip -9 -kf dist/js/*.js dist/css/*.css

# 本番環境
FROM nginx:1.15.3-alpine
EXPOSE 80
COPY ./docker/nginx/conf.d /etc/nginx/conf.d/
COPY --from=build /app/dist /usr/share/nginx/html
CMD ["nginx", "-g", "daemon off;"]
