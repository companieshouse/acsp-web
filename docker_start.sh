#!/bin/bash
# Start script for ascp-web
npm i
PORT=3000

export NODE_PORT=${PORT}

for entry in /opt/*
do
  echo "$entry"
done

exec node /opt/src/main/server.js -- ${PORT}
