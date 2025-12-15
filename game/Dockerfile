FROM node:22-alpine

WORKDIR /app

# Copy dependency files first (better caching)
COPY package.json package-lock.json* ./

RUN npm install

# Copy rest of the client
COPY . .

EXPOSE 5173

CMD ["npm", "run", "dev"]
