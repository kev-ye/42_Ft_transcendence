# Specify Node Version and Image
# Name Image development (can be anything)
FROM node:16.13.2 AS development

# Specify Working directory inside container
WORKDIR /pong/back-end

# Copy package-lock.json & package.json from host to inside container working directory
COPY package*.json ./

# Install deps inside container
RUN npm install

# Bundle App sources
COPY . .

RUN npm run build

EXPOSE 3000 3001 3002

################
## PRODUCTION ##
################
# Build another image named production
FROM node:16.13.2 AS production

ARG NODE_ENV=production
ENV NODE_ENV=${NODE_ENV}

# Set work dir
WORKDIR /pong/back-end

COPY package*.json ./

RUN npm install

COPY . .

COPY --from=development /pong/back-end/dist ./dist

EXPOSE 3000 3001 3002

# run app
CMD [ "node", "dist/main"]