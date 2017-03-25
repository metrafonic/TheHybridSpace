FROM node:argon

MAINTAINER Mathias Fredrik Hedberg <hedberg.mathias@gmail.com>


# Create app directory
RUN mkdir -p /usr/src
WORKDIR /usr/src/app

COPY package.json /usr/src/app/
RUN mkdir /docker-entrypoint-initdb.d
COPY initdb/initdb.sql /docker-entrypoint-initdb.d/initdb.sql
RUN npm install

COPY . /usr/src/app

EXPOSE 3000

CMD ./start.sh
