# Base image
FROM node:latest

COPY package*.json ./

# 캐시 정리 후 설치
RUN npm cache clean --force && npm install

# Copy the rest of the application
COPY . .

# Expose port
EXPOSE 3000

# Run application
CMD ["npm", "start"]