FROM node:alpine

WORKDIR /data-service/

COPY package.json .
RUN npm install && npm install typescript -g
COPY . .
RUN tsc
EXPOSE 4000
CMD ["node", "build/index.js"]