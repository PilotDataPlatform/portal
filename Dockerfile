FROM node:14
COPY package.json ./
COPY package-lock.json  ./
COPY yarn.lock ./
RUN npm install
RUN npm install -g supervisor
COPY .  ./

EXPOSE 3000
CMD npm run build && node index.js
