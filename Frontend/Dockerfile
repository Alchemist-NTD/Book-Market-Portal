# build stage
FROM node:19.3.0-alpine3.16

WORKDIR /app

COPY . .

RUN cd book_market_fe && npm install

EXPOSE 3000
