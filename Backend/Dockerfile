# 1. Start from Node.js LTS image
FROM node:20

# 2. Set working directory
WORKDIR /usr/src/app

# 3. Copy dependency manifests and install
COPY package*.json ./
RUN npm install

# 4. Copy Prisma schema and generate the Prisma client
COPY prisma ./prisma
RUN npx prisma generate

# 5. Copy the rest of the application code
COPY . .

# 6. Build the app (if using TypeScript)
RUN npm run build

# 7. Expose the port your app uses (commonly 3000)
EXPOSE 3000

# 8. Start the app (no need for dotenv in production, env vars are injected)
CMD ["npm", "run", "start:prod"]
