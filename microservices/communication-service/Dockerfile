FROM node:alpine

WORKDIR /communication-service

COPY package.json .
RUN npm install && npm install typescript -g
COPY . .
RUN tsc
EXPOSE 3010
CMD ["node", "build/index.js"]