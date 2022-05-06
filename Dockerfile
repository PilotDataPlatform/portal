FROM node:14
COPY package.json ./
COPY package-lock.json  ./
COPY yarn.lock ./
RUN npm install
RUN npm install -g serve
COPY .  ./

EXPOSE 3000
CMD npm run build && serve -s build -p 3000
