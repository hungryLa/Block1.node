FROM node:22-alpine

WORKDIR /app

COPY package*.json ./

RUN npm install

COPY . .

RUN cp .env.example .env

EXPOSE 3000

CMD ["node", "src/server.js"]