FROM vladdesv/node17-magick7.1:v2

# copy resources for generator
COPY build/bundle.js translations.json .env ./
COPY resource resource
COPY resource-gbc resource-gbc
COPY resource-pixelprofilgate resource-pixelprofilgate

CMD node ./bundle.js
