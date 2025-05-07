# Use official Node image
FROM node:18

# Create app directory
WORKDIR /app

# Copy package files
COPY package*.json ./

# Install dependencies
RUN npm install

# Copy the rest of the app
COPY . .

# Expose the port your app runs on
EXPOSE 5000

# Start the app
CMD ["node", "app.js"]