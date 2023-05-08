FROM node:14-alpine

WORKDIR /app

COPY . .

RUN npm install

RUN npx tailwindcss init

COPY . .

EXPOSE 3000

CMD [ "npm", "start", "--no-inotify"]
