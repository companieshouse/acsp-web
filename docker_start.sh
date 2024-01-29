#!/bin/bash
# Start script for ascp-web
npm i
PORT=3000

export NODE_PORT=${PORT}
exec node /opt/bin/www.js -- ${PORT}