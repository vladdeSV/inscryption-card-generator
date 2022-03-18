FROM node:17.7-slim

# copy resources for generator
COPY build/bundle.js creatures.txt translations.json ./
COPY resource resource
COPY resource-gbc resource-gbc

# install dependencies
RUN apt update
RUN apt install -y imagemagick nginx

# copy nginx conf
COPY nginx.conf /etc/nginx/nginx.conf

CMD service nginx start && node ./bundle.js
