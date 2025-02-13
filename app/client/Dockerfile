# client/Dockerfile
# build stage
FROM node:18-alpine AS build
WORKDIR /app
COPY package*.json ./
RUN npm install
COPY . .
# RUN groupadd -r nodejs && useradd -g nodejs nodejs
# RUN chown -R nodejs:nodejs /app
# USER nodejs
RUN chown -R node:node /app
USER node
ARG MODE
RUN npm run build -- --mode=${MODE}

# production stage
FROM nginx:alpine
# RUN groupadd -r nodejs && useradd -g nodejs nodejs
# RUN chown -R nodejs:nodejs /app
# USER nodejs

COPY --from=build /app/dist /usr/share/nginx/html
EXPOSE 80
