# Use official Node.js 18 LTS image
FROM node:18

# Set working directory inside container
WORKDIR /usr/src/app

# Copy package.json and package-lock.json first (better caching)
COPY package*.json ./

# Install dependencies
RUN npm install

# Copy the rest of the API code
COPY . .

# Expose backend port
EXPOSE 3001

# Start the API server
CMD ["node", "api.js"]
