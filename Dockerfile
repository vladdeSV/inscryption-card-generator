FROM node:17.7-slim
COPY ["./build/bundle.js", "./"]
CMD ["node", "./bundle.js"]
