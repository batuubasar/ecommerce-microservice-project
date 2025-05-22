FROM node:20-alpine

WORKDIR /usr/src/app

COPY . .

RUN npm install

RUN npm run build

# Libs servisinin ayakta kalması için dummy işlem
CMD ["tail", "-f", "/dev/null"]