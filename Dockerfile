FROM node:17.7-slim

# copy resources for generator
COPY build/bundle.js creatures.txt translations.json ./
COPY resource resource
COPY resource-gbc resource-gbc

# install dependencies
RUN apt update
RUN apt install -y imagemagick

CMD export NODE_ENV=production; node ./bundle.js
