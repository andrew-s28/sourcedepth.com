# syntax=docker/dockerfile:1

ARG NODE_VERSION=22.13.1

FROM node:${NODE_VERSION}-alpine AS base

FROM base AS prod
USER node
WORKDIR /usr/src/app
COPY --chown=node . .
RUN npm ci --omit=dev
RUN npm run build
EXPOSE 3000
CMD ["node", ".output/server/index.mjs"]
