# server/Dockerfile
# build stage
FROM node:18-alpine
WORKDIR /app
COPY package*.json ./
RUN npm install
COPY . .
RUN chown -R node:node /app
USER node
CMD ["npm","run", "dev"]