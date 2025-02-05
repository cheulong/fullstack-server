FROM node:18-alpine
WORKDIR /app
COPY package*.json ./
RUN npm install
COPY . .
EXPOSE 8080
# RUN groupadd -r nodejs && useradd -g nodejs nodejs
# RUN chown -R nodejs:nodejs /app
# USER nodejs
RUN chown -R node:node /app
USER node
CMD ["npm", "run", "dev"]
