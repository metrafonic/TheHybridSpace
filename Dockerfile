FROM node:argon

MAINTAINER Mathias Fredrik Hedberg <hedberg.mathias@gmail.com>


# Create app directory
RUN mkdir -p /usr/src
WORKDIR /usr/src/
RUN git clone https://github.com/metrafonic/TheHybridSpace.git app
WORKDIR /usr/src/app
RUN npm install

EXPOSE 3000

CMD ./start.sh
