#!/bin/bash
#
# Start script for acsp-web

PORT=3000

export NODE_PORT=${PORT}

exec node /opt/dist/src/server.js -- ${PORT}