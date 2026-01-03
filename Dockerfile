
# Use a lightweight Nginx image
FROM nginx:alpine

# Remove the default config and add ours
RUN rm -f /etc/nginx/conf.d/default.conf || true
COPY nginx.conf /etc/nginx/nginx.conf

# Copy static website files
COPY index.html /usr/share/nginx/html/
COPY features.html /usr/share/nginx/html/
COPY contact.html /usr/share/nginx/html/
COPY assets/ /usr/share/nginx/html/assets/

# Expose port
EXPOSE 80

# Default command
CMD ["nginx", "-g", "daemon off;"]
