FROM node:20-alpine
WORKDIR /app

COPY package*.json ./
RUN npm install --quiet

# Copy all remaining files
COPY . .


EXPOSE 5000
CMD ["node", "src/server.js"]

