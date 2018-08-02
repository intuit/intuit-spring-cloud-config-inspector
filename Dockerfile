FROM node:8
MAINTAINER Marcello_deSales@intuit.com

# The name of the app that will run "proxy or app"
ARG appname

WORKDIR /app

ADD package.json /app/
RUN npm install

EXPOSE 3232

ADD . /app/
