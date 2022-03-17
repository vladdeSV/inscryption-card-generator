FROM node:17.7-slim
COPY ["./build/bundle.js", "resources", "resources-gbc", "./"]
CMD ["node", "./bundle.js"]
