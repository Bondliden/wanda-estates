# Use Node.js 22 alpine for a small image size
FROM node:22-alpine

# Set working directory
WORKDIR /app

# Copy package files
COPY package*.json ./

# Install dependencies
RUN npm install

# Copy the rest of the application code
COPY . .

# Build the application
RUN npm run build

# Expose the application port
EXPOSE 5000

# Set environment variable to production
ENV NODE_ENV=production

# Start the application
CMD ["npm", "start"]
