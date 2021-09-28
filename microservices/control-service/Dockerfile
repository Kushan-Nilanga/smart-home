FROM node:alpine

WORKDIR /control-service

COPY package.json .
RUN npm install && npm install typescript -g
COPY . .
RUN tsc
EXPOSE 3020
CMD ["node", "build/index.js"]