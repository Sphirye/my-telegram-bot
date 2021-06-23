 
FROM node:12

WORKDIR /app

COPY package*.json .

RUN npm config set registry https://registry.npmjs.org/

RUN npm install

COPY . .

RUN npm run build

CMD ['npm', "run", "start"]