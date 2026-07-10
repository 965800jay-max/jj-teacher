FROM node:22-alpine AS build
WORKDIR /app
COPY package*.json ./
RUN npm ci
COPY . .
RUN npm run build

FROM node:22-alpine
WORKDIR /app
ENV HOST=0.0.0.0
ENV PORT=5188
COPY package*.json ./
RUN npm ci --omit=dev
COPY --from=build /app/dist ./dist
COPY --from=build /app/local-server.mjs ./local-server.mjs
COPY --from=build /app/public ./public
EXPOSE 5188
CMD ["node", "local-server.mjs"]
