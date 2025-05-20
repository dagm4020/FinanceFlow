# Dockerfile for React Frontend

# Base image
FROM node:18-alpine

# Set working directory
WORKDIR /app

# Copy package files and install dependencies
COPY package*.json ./
RUN npm install

# Copy all project files
COPY . .

# Use the correct .env file based on the environment
ARG NODE_ENV
ENV NODE_ENV $NODE_ENV

# Build the React app based on the environment
RUN npm run build

# Expose port 3000
EXPOSE 3000

# Serve the React app
CMD ["npx", "serve", "-s", "build", "-l", "3000"]
