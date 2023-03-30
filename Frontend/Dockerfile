# build stage
FROM node:19.3.0-alpine3.16

WORKDIR /app

COPY . .

WORKDIR /app/book_market_fe

RUN npm install

EXPOSE 3000

CMD [ "npm", "start" ]
