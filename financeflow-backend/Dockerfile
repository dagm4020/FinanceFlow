# Dockerfile for Node.js Backend

# 1. Base Image - We use an official Node.js image (lightweight version)
FROM node:18-alpine

# 2. Set the Working Directory inside the container
WORKDIR /app

# 3. Copy package.json and package-lock.json first
COPY package*.json ./

# 4. Install Dependencies
RUN npm install

# 5. Copy the entire backend code (except what is in .dockerignore)
COPY . .

# 6. Expose Port 5005 (Your backend server port)
EXPOSE 5005

# 7. Command to Start Your Backend Server
CMD ["node", "server.js"]

