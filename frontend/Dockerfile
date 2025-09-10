FROM node:24-alpine3.21 AS builder

WORKDIR /app

COPY package*.json ./
RUN npm install

COPY . .
COPY .env.local ./
RUN npm run build

FROM node:24-alpine3.21

WORKDIR /prod

COPY --from=builder /app/.next ./.next
COPY --from=builder /app/node_modules ./node_modules
COPY --from=builder /app/package*.json ./
COPY --from=builder /app/.env.local ./.env.local

EXPOSE 3000
CMD ["npm", "start"]