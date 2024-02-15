#!/bin/bash
#
# Start script for acsp-web

PORT=3000

export NODE_PORT=${PORT}
for entry in /opt/*
do
  echo "$entry"
done
echo "now printing dist---------"
for entry in /opt/dist/*
do
  echo "$entry"
done
echo "now printing node modules---------"
for entry in /opt/node_modules/*
do
  echo "$entry"
done
echo "now printing node companies house ---------"
for entry in /opt/node_modules/@companieshouse
do
  echo "$entry"
done
exec node /opt/dist/src/main/server.js -- ${PORT}
