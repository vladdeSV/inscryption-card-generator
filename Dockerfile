FROM vladdesv/node17.7-magick7.1:v1

# copy resources for generator
COPY build/bundle.js translations.json ./
COPY resource resource
COPY resource-gbc resource-gbc

CMD node ./bundle.js
