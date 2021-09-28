FROM node:alpine

WORKDIR /health-service/

COPY package.json .
RUN npm install && npm install typescript -g
COPY . .
RUN tsc
EXPOSE 3000
CMD ["node", "build/index.js"]