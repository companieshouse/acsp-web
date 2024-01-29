ARG IMAGE_VERSION="latest"
FROM 416670754337.dkr.ecr.eu-west-2.amazonaws.com/ci-node-runtime-20:${IMAGE_VERSION} 
WORKDIR /opt/dist
COPY dist docker_start.sh ./
COPY ./package.json ./package-lock.json /opt/

CMD ["./docker_start.sh"]

EXPOSE 3000