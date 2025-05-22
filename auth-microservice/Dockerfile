FROM node:20-alpine
 
WORKDIR /usr/src/app/auth-microservice

COPY ./auth-microservice/package*.json ./

RUN npm install

COPY ./auth-microservice ./

RUN apk add --no-cache netcat-openbsd

CMD ["npm", "run", "start:dev"]


