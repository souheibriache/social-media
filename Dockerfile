# Build Stage
FROM node:18-alpine AS build
WORKDIR /app
COPY package*.json ./
RUN npm install
COPY . .
RUN npm run build

# Production Stage
FROM node:18-alpine AS production
WORKDIR /app

# Install production dependencies and module-alias
COPY --from=build /app/package*.json ./ 
RUN npm install --only=production && npm install module-alias

# Now copy the built JavaScript files
COPY --from=build /app/build ./build

EXPOSE 3000 3003

# Set NODE_ENV for production
ENV NODE_ENV=production

# Run the server
CMD ["npm", "run", "start"]
