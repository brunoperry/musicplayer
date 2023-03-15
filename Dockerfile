#FROM alpine
FROM alpine

RUN apk add --update nodejs npm
RUN npm install pm2 -g

# Setup project structure
COPY public /app/public
COPY package.json /app/package.json
COPY package-lock.json /app/package-lock.json
COPY server.js /app/server.js
COPY utils.js /app/utils.js
WORKDIR /app

# Build project code (in the image itself)
RUN npm ci

# Run app
CMD npm run production
