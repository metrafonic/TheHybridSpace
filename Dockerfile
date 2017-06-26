FROM node:argon

MAINTAINER Mathias Fredrik Hedberg <hedberg.mathias@gmail.com>


# Create app directory
RUN mkdir -p /usr/src
WORKDIR /usr/src/
COPY . app
WORKDIR /usr/src/app
RUN npm install

EXPOSE 3000

CMD ./start.sh
