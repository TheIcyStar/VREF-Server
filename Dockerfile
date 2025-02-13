FROM node:22-alpine
WORKDIR /var/app

COPY package.json .
RUN npm install &&\
    npm install typescript -g

COPY . .
RUN tsc

CMD ["node", "./build/app.js"]
EXPOSE 3000