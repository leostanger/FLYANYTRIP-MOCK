# Use a stable Node.js alpine image
FROM node:22-alpine

WORKDIR /app

# Copy dependency manifests
COPY package*.json ./

# Install all dependencies, ignoring postinstall to prevent premature prisma generate
RUN npm install --ignore-scripts

# Copy source code
COPY . .

# Generate Prisma Client (Requires the schema to be present)
RUN npx prisma generate

# Expose the backend port
EXPOSE 5000

# Start the Node server
CMD ["npm", "start"]
