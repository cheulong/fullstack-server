# server/Dockerfile
# build stage
FROM node:18-alpine as build
WORKDIR /app
COPY package*.json ./
RUN npm ci --only=production

# production stage
FROM node:18-alpine
WORKDIR /app
COPY --from=build /app/node_modules ./node_modules
COPY . .
RUN chown -R node:node /app
USER node
CMD ["node", "server.js"]