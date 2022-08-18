#! /bin/env bash
set -e

STAGING_DOCKER_IMAGE=146628656107.dkr.ecr.us-west-2.amazonaws.com/gravitational/docs:$COMMIT_SHA
PRODUCTION_DOCKER_IMAGE=public.ecr.aws/gravitational/docs:latest

## Install aws
apt install -y unzip
curl "https://awscli.amazonaws.com/awscli-exe-linux-x86_64.zip" -o "awscliv2.zip"
unzip "awscliv2.zip"
./aws/install

## Build Docker Image
echo Building $STAGING_DOCKER_IMAGE

DOCKER_BUILDKIT=1 docker build -t $STAGING_DOCKER_IMAGE .

## Authenticate to Staging AWS Registry
export AWS_ACCESS_KEY_ID=$STAGING_DOCS_ECR_KEY
export AWS_SECRET_ACCESS_KEY=$STAGING_DOCS_ECR_SECRET

aws ecr get-login-password --region us-west-2 | docker login -u="AWS" --password-stdin 146628656107.dkr.ecr.us-west-2.amazonaws.com

## Push Staging Image
if DOCKER_CLI_EXPERIMENTAL=enabled docker manifest inspect "$STAGING_DOCKER_IMAGE" >/dev/null 2>&1; then
  echo "$STAGING_DOCKER_IMAGE already exists. "
else
  docker push $STAGING_DOCKER_IMAGE
fi

## Authenticate to Production AWS Registry
docker logout 146628656107.dkr.ecr.us-west-2.amazonaws.com
export AWS_ACCESS_KEY_ID=$PRODUCTION_DOCS_ECR_KEY
export AWS_SECRET_ACCESS_KEY=$PRODUCTION_DOCS_ECR_SECRET
aws ecr-public get-login-password --region us-east-1 | docker login -u="AWS" --password-stdin public.ecr.aws

## Push Production Image
docker tag $STAGING_DOCKER_IMAGE $PRODUCTION_DOCKER_IMAGE
docker push $PRODUCTION_DOCKER_IMAGE
