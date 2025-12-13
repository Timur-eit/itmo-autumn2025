# build stage
FROM node:20-alpine AS build

# временный контейнер для сборки – артефакт сборки
# ставятся все зависимости включая dev
# компилируется TS в JS
# появляется /app/dist
# этот stage не запускается и после сборки он выбрасывается

WORKDIR /app

COPY package.json package-lock.json ./
RUN npm ci

COPY . .

RUN npm run build


# runtime (финальный образ) stage
FROM node:20-alpine

# только результат сборки, а не исходники

WORKDIR /app

COPY package.json package-lock.json ./
RUN npm ci --omit=dev 
# ci чтобы всегда ставил версии только из лока и не менял package.json

COPY --from=build /app/dist ./dist

EXPOSE 8080

# выполнить при запуске контейнера
CMD ["node", "dist/index.js"]

# без multi-stage image был бы больше, грязнее с dev зависимостями
	
