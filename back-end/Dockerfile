# Specify Node Version and Image
# Name Image development (can be anything)
FROM node:16.13.2 AS development

# Specify Working directory inside container
WORKDIR /pong/src/app

# Copy package-lock.json & package.json from host to inside container working directory
COPY package*.json ./

# Install deps inside container
RUN npm install

RUN npm run build

EXPOSE 3000
EXPOSE 3001
EXPOSE 3002

################
## PRODUCTION ##
################
# Build another image named production
FROM node:latest AS production

ARG NODE_ENV=production
ENV NODE_ENV=${NODE_ENV}

# Set work dir
WORKDIR /pong/src/app

COPY --from=development /pong/src/app/ .

EXPOSE 3000
EXPOSE 3001
EXPOSE 3002

# run app
CMD [ "node", "dist/main"]