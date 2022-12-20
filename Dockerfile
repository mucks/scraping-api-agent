FROM zenika/alpine-chrome:with-playwright

USER root

RUN apk update && apk upgrade
RUN apk add openvpn sudo
RUN addgroup sudo
RUN addgroup chrome sudo
RUN echo '%sudo ALL=(ALL) NOPASSWD:ALL' >> /etc/sudoers

USER chrome

WORKDIR /app

COPY package.json .

RUN npm install

COPY src src

COPY docker-entrypoint.sh docker-entrypoint.sh

ENTRYPOINT [ "./docker-entrypoint.sh" ]

