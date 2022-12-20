FROM mcr.microsoft.com/playwright:v1.29.0-focal

RUN apt update -y && apt upgrade -y
RUN apt install -y openvpn

WORKDIR /app

COPY package.json .

RUN npm install

COPY src src

COPY docker-entrypoint.sh docker-entrypoint.sh

ENTRYPOINT [ "./docker-entrypoint.sh" ]

