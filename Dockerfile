FROM node:17.7-slim

# copy resources for generator
COPY build/bundle.js translations.json ./
COPY resource resource
COPY resource-gbc resource-gbc

# install correct version of imagemagick
RUN apt update && apt install -y wget
RUN t=$(mktemp) && wget 'https://dist.1-2.dev/imei.sh' -qO "$t" && bash "$t" && rm "$t"

CMD node ./bundle.js
