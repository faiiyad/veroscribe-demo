FROM node:20-bookworm

WORKDIR /app

# Install dependencies first (layer caching)
COPY package.json ./
RUN npm install --production

COPY . .

EXPOSE 4000

HEALTHCHECK --interval=30s --timeout=5s --start-period=10s \
  CMD wget -qO- http://localhost:4000/api/health || exit 1

CMD ["node", "server.js"]
