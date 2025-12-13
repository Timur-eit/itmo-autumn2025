FROM node:20-alpine AS build

WORKDIR /app

# зависимости
COPY package.json package-lock.json ./
RUN npm ci

# исходники
COPY . .
RUN npm run build


FROM nginx:stable-alpine

# удаляется дефолтный конфиг
RUN rm /etc/nginx/conf.d/default.conf

# используется свой конфиг
COPY nginx/default.conf /etc/nginx/conf.d/default.conf

COPY --from=build /app/dist /usr/share/nginx/html

EXPOSE 80