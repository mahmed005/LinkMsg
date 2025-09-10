FROM node:24-alpine3.21 AS builder

WORKDIR /app

COPY package*.json ./
RUN npm install

COPY . .
COPY .env ./
RUN npm run build

FROM node:24-alpine3.21

WORKDIR /prod

COPY --from=builder /app/dist ./dist
COPY --from=builder /app/node_modules ./node_modules
COPY --from=builder /app/.env ./.env

ENTRYPOINT ["node"]
CMD ["./dist/index.js"]