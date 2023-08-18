# Use the Alpine Linux base image
FROM alpine:latest

# Install NGINX
RUN apk update && \
    apk add --no-cache nginx

# Copy the NGINX configuration
COPY nginx.conf /etc/nginx/nginx.conf

# Copy the contents of the 'html' folder to the NGINX document root
COPY deploy/html/ /usr/share/nginx/html/

# Expose port 80 for the web server
EXPOSE 80

# Start the NGINX web server
CMD ["nginx", "-g", "daemon off;"]
