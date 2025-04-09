FROM node:20-alpine as build

WORKDIR /app

COPY package*.json ./
RUN npm ci

COPY . .
RUN npm run build

FROM nginx:stable-alpine

COPY --from=build /app/dist /usr/share/ngnix/html

EXPOSE 80

CMD ["ngnix", "-g", "daemon off;"]
