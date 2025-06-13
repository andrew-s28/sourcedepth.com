# syntax=docker/dockerfile:1

ARG NODE_VERSION=22.13.1

FROM node:${NODE_VERSION}-alpine as base
WORKDIR /usr/src/app

FROM base as prod
COPY ./package.json ./package.json
COPY ./package-lock.json ./package-lock.json
RUN npm ci --omit=dev
EXPOSE 3000
USER node
COPY ./public ./public
COPY ./mdx ./mdx
COPY ./src ./src
COPY ./.output ./.output
COPY ./vite.config.ts ./vite.config.ts
COPY ./tsconfig.json ./tsconfig.json
CMD node .output/server/index.mjs