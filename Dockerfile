FROM node:10.16-alpine AS builder

# Define working directory
WORKDIR /src
# Install dependencies (babel, grunt, webpack, etc.)
COPY ["package.json", "package-lock.json*", "npm-shrinkwrap.json*", "./"]
RUN npm install
# Copy source code
COPY . .
#  Build whatever you have to build 
RUN npm run build

FROM node:10.16-alpine
ENV NODE_ENV=production
# RUN groupadd -r nodejs && useradd -m -r -g -s /bin/bash nodejs nodejs
# USER nodejs
WORKDIR /usr/src/app
RUN mkdir -p logs
# Expose ports (for orchestrators and dynamic reverse proxies)
EXPOSE 3000

# Install deps for production only
COPY ./package* ./
RUN npm install --production --silent && \
  npm cache clean --force
# Copy builded source from the upper builder stage
COPY --from=builder /src/dist ./dist

# Start the app
CMD ["node", "dist/index.js"]