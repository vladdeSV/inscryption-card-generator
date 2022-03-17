FROM node:17.7-slim
COPY ["build/bundle.js", "creatures.txt", "translations.json", "./"]
COPY ["resource", "resource"]
COPY ["resource-gbc", "resource-gbc"]
RUN apt install nginx --yes
COPY ["nginx.conf", "/etc/nginx/nginx.conf"]
RUN service nginx restart
CMD ["node", "./bundle.js"]
