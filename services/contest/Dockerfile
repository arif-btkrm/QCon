FROM node:18-alpine

WORKDIR /app

COPY package*.json ./

RUN npm install
RUN npm install -g nodemon

EXPOSE 3001

COPY . .

ENV TZ "Asia/Dhaka"

CMD ["npm","run","dev"]