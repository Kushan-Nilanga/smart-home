FROM node:alpine

WORKDIR /usr/mqtt-service/

COPY package.json .
RUN npm install && npm install typescript -g
COPY . .
RUN tsc
CMD ["node", "dist/index.js"]