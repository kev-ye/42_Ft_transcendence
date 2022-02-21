# Stage 1: build
FROM node:16.13.2 AS development

WORKDIR /pong/front-end/src/app

COPY package*.json ./

RUN npm install -g npm@8.5.1
RUN npm install
RUN npm install -g @angular/cli

COPY . .

RUN npm run build

EXPOSE 4200
