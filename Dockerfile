FROM node:alpine as builder

WORKDIR /app

COPY tsconfig.json .
COPY package.json .

RUN npm install

COPY src src

RUN npm run build



FROM zenika/alpine-chrome:with-playwright

USER root

RUN apk add --no-cache openvpn sudo
RUN addgroup sudo
RUN addgroup chrome sudo
RUN echo '%sudo ALL=(ALL) NOPASSWD:ALL' >> /etc/sudoers

USER chrome

WORKDIR /app

COPY package.json .

RUN NODE_ENV=production npm install

COPY --from=builder /app/dist ./dist
RUN sudo chown -R chrome:chrome /app

COPY docker-entrypoint.sh docker-entrypoint.sh

ENTRYPOINT [ "./docker-entrypoint.sh" ]

