FROM node:20-alpine

WORKDIR /app

COPY package*.json ./

#healtycheck için
RUN apk add --no-cache netcat-openbsd

RUN npm install

COPY . .

CMD ["npm", "run", "start:dev"]
