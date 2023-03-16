#FROM alpine
FROM alpine

RUN apk add --update nodejs npm
RUN npm install pm2 -g

# Setup project structure
COPY public/index.html /app/public/index.html
COPY public/manifest.json /app/public/manifest.json
COPY public/service-worker.js /app/public/service-worker.js
COPY public/app_logo.svg /app/public/app_logo.svg
COPY public/images /app/public/images
COPY package.json /app/package.json
COPY package-lock.json /app/package-lock.json
COPY .env /app/.env
COPY config.js /app/config.js
COPY firebase.js /app/firebase.js
COPY server.js /app/server.js
WORKDIR /app

# Build project code (in the image itself)
RUN npm ci

# Run app
CMD npm run production
