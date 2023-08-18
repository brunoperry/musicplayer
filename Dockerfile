# Use the Alpine Linux base image
#FROM arm64v8/alpine
FROM alpine:latest

RUN apk update && \
    apk add --no-cache nginx

COPY nginx.conf /etc/nginx/nginx.conf

COPY deploy/html/ /usr/share/nginx/html/

EXPOSE 80

CMD ["nginx", "-g", "daemon off;"]
