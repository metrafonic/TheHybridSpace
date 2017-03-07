FROM node:argon

MAINTAINER Mathias Fredrik Hedberg <hedberg.mathias@gmail.com>


# Create app directory
RUN mkdir -p /usr/src
WORKDIR /usr/src/app

COPY package.json /usr/src/app/
RUN npm install

COPY . /usr/src/app

EXPOSE 3000

CMD git pull; npm install; npm start
