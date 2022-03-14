# Stage 1: build development image
FROM node:16.13.2-alpine AS development

WORKDIR /pong/back-end

RUN npm cache clean --force
#COPY package*.json ./
COPY . .

RUN npm install -g npm@8.5.4
RUN npm install

RUN npm run build

EXPOSE 3000 3001 3002

# Stage 2: build production image
FROM node:16.13.2-alpine AS production

ARG NODE_ENV=production
ENV NODE_ENV=${NODE_ENV}

WORKDIR /pong/back-end

RUN npm install -g npm@8.5.4
RUN npm cache clean --force
#COPY package*.json ./
COPY . .

RUN npm install

COPY --from=development /pong/back-end/dist ./dist

EXPOSE 3000 3001 3002

# run app
CMD [ "node", "dist/main"]