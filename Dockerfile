FROM node:17.7-slim
COPY ["./build/bundle.js", "resource", "resource-gbc", "./"]
CMD ["node", "./bundle.js"]
