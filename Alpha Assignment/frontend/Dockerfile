# frontend/Dockerfile
FROM node:18-slim

WORKDIR /app

COPY package*.json ./

# ✅ Allow optional dependencies like rollup-linux-arm64
ENV npm_config_optional=true

# ✅ Force linux + arm64 arch installation
RUN npm install --platform=linux --arch=arm64

COPY . .

EXPOSE 5173

CMD ["npm", "run", "dev"]

