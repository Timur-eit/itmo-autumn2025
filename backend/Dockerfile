FROM node:20-alpine

WORKDIR /app

# ts-node-dev требует devDependencies
COPY package*.json ./
RUN npm install

COPY . .

EXPOSE 8080

CMD ["npm", "run", "dev"]