FROM node:12
COPY package.json ./
COPY package-lock.json  ./
COPY yarn.lock ./
RUN npm install
COPY .  ./

EXPOSE 3000
CMD npm start
