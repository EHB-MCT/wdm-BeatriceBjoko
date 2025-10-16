FROM node:latest
WORKDIR /app

COPY package*.json ./
RUN npm install --quiet

# Copy all remaining files
COPY . .


EXPOSE 5000
CMD ["node", "index.js"]

