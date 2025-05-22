FROM node:20-alpine
 
WORKDIR /usr/src/app/users-microservice

COPY ./users-microservice/package*.json ./

RUN npm install

COPY ./users-microservice ./

RUN apk add --no-cache netcat-openbsd

CMD ["npm", "run", "start:dev"]


