# Use a specific node image version with Alpine
FROM node:20.15.1-alpine3.19

# Create and set the working directory
WORKDIR /usr/src/app

# Copy package.json and package-lock.json
COPY package*.json ./

# Install dependencies
RUN npm install

# Copy the rest of the application code
COPY . .

# # Install middleware dependencies
# RUN cd /usr/src/app/middleware && npm install

# # Install db dependencies
# RUN cd /usr/src/app/db && npm install

# Expose the application port
EXPOSE 5000

# Start the application
CMD ["node", "index.js"]
