FROM node:17.7-slim
COPY ["build/bundle.js", "creatures.txt", "translations.json", "./"]
COPY ["resource", "resource"]
COPY ["resource-gbc", "resource-gbc"]
run apt update
run apt install -y imagemagick
CMD ["node", "./bundle.js"]
