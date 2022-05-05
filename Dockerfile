FROM node:12
COPY package.json ./
COPY package-lock.json  ./
COPY yarn.lock ./
RUN npm install
RUN npm install pm2 -g
COPY .  ./

EXPOSE 3000
CMD pm2 --name portal start npm -- start
