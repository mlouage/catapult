#!/bin/sh
# Change into the API directory so dotenv/config picks up .env
cd /app/api
# Start the Node.js API server in the background
node index.js &
# Return to root for nginx
cd /
# Start NGINX in the foreground
nginx -g 'daemon off;'