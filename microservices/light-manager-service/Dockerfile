FROM node:alpine

WORKDIR /light-manager-service

COPY package.json .
RUN npm install && npm install typescript -g
COPY . .
RUN tsc
CMD ["node", "build/index.js"]