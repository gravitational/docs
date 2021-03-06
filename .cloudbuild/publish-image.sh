#! /bin/env bash
set -e
IMAGE_NAME=$DOCKER_REGISTRY/$DOCKER_REPOSITORY:$DOCKER_TAG
echo Building $IMAGE_NAME
DOCKER_BUILDKIT=1 docker build -t $IMAGE_NAME .
echo $QUAYIO_DOCKER_PASSWORD | docker login -u $QUAYIO_DOCKER_USERNAME --password-stdin $DOCKER_REGISTRY
docker push $IMAGE_NAME
