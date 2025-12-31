# Use the Node alpine official image
FROM node:lts-alpine AS build

# Create and change to the app directory
WORKDIR /app

# Copy package files
COPY package*.json pnpm-lock.yaml ./

# Install pnpm globally
RUN npm install -g pnpm

# Install packages
RUN pnpm install --frozen-lockfile

# Add build arguments
ARG VITE_SUPABASE_URL
ARG VITE_SUPABASE_ANON_KEY

# Set environment variables for the build
ENV VITE_SUPABASE_URL=$VITE_SUPABASE_URL
ENV VITE_SUPABASE_ANON_KEY=$VITE_SUPABASE_ANON_KEY

# Copy local code
COPY . ./

# Build the app
RUN pnpm build

CMD ["pnpm", "run", "preview"]