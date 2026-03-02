# syntax=docker/dockerfile:1

ARG NODE_VERSION=22.13.1

FROM node:${NODE_VERSION}-bookworm-slim AS base

FROM base AS builder
USER node
WORKDIR /usr/src/app
COPY --chown=node . .
# optional deps necessary for building on Docker
RUN npm ci --include=optional --omit=dev
RUN npm run build

FROM base AS prod
USER node
WORKDIR /usr/src/app
COPY --from=builder --chown=node /usr/src/app/.output ./.output
COPY --from=builder --chown=node /usr/src/app/node_modules ./node_modules
EXPOSE 3000
CMD ["node", ".output/server/index.mjs"]
