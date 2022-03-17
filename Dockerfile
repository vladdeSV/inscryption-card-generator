FROM node:17
COPY ["./build/bundle.js", "./"]
CMD ["node", "./bundle.js"]
