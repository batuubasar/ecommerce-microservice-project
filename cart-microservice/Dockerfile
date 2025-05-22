FROM node:20-alpine
 
WORKDIR /usr/src/app/cart-microservice

COPY ./cart-microservice/package*.json ./

RUN npm install

COPY ./cart-microservice ./

RUN apk add --no-cache netcat-openbsd

CMD ["npm", "run", "start:dev"]


