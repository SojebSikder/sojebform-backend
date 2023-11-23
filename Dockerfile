FROM node:18-alpine3.11

WORKDIR /app

ADD . /app

RUN pnpm install

RUN pnpm build

EXPOSE 8000