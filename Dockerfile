FROM node:alpine

WORKDIR /usr/src/app
COPY package*.json ./
RUN npm install
RUN apt update && apt install -y curl
COPY . .
EXPOSE 5000

CMD ["npm","start"]