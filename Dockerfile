# specify node image
FROM node:8

# create app directory
WORKDIR /usr/src/app

# install app dependencies
COPY package*.json ./

RUN npm install

# bundle app source
COPY . .

EXPOSE 8080 8081

CMD [ "npm", "start" ]
