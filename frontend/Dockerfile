# Build stage
FROM node:16.13.2-alpine as build
WORKDIR /app
COPY package.json ./
RUN npm install
COPY . ./
RUN npm run build

# Release stage
FROM nginx:1.21.5-alpine as release
COPY --from=build /app/dist/ /usr/share/nginx/html/
EXPOSE 9000
CMD ["nginx", "-g", "daemon off;"]
