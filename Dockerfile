FROM node:14-slim
WORKDIR /src
COPY . /src
RUN yarn && yarn build-node
VOLUME ["/src"]
