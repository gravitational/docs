#! /bin/env bash
set -e

STAGING_DOCKER_IMAGE=146628656107.dkr.ecr.us-west-2.amazonaws.com/gravitational/docs:$COMMIT_SHA
PRODUCTION_DOCKER_IMAGE=public.ecr.aws/gravitational/docs:latest

## Install aws
apt install awscli

## Build Docker Image
echo Building $STAGING_DOCKER_IMAGE

DOCKER_BUILDKIT=1 docker build -t $STAGING_DOCKER_IMAGE .

## Authenticate to Staging AWS Registry
export AWS_ACCESS_KEY_ID=$STAGING_DOCS_ECR_KEY
export AWS_ACCESS_SECRET_KEY=$STAGING_DOCS_ECR_SECRET

aws ecr get-login-password --region us-west-2 | docker login -u="AWS" --password-stdin 146628656107.dkr.ecr.us-west-2.amazonaws.com

## Push Staging Image
docker push $STAGING_DOCKER_IMAGE

## Authenticate to Production AWS Registry
docker logout 146628656107.dkr.ecr.us-west-2.amazonaws.com
export AWS_ACCESS_KEY_ID=$PRODUCTION_DOCS_ECR_KEY
export AWS_ACCESS_SECRET_KEY=$PRODUCTION_DOCS_ECR_SECRET
aws ecr-public get-login-password --region us-east-1 | docker login -u="AWS" --password-stdin public.ecr.aws

## Push Production Image
docker tag $STAGING_DOCKER_IMAGE $PRODUCTION_DOCKER_IMAGE
docker push $PRODUCTION_DOCKER_IMAGE