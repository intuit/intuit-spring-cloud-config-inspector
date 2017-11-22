FROM node:8
MAINTAINER Marcello_deSales@intuit.com

# The name of the app that will run "proxy or app"
ARG appname

WORKDIR /app

ADD . /app/

EXPOSE 3232

RUN npm install
