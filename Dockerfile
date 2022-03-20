FROM node:17.7-slim

# copy resources for generator
COPY build/bundle.js creatures.txt translations.json ./
COPY resource resource
COPY resource-gbc resource-gbc
COPY magick /usr/local/bin

# alias for magick
RUN ln -s /usr/local/bin/magick /usr/local/bin/convert
RUN PATH=/usr/local/bin:$PATH

CMD node ./bundle.js
