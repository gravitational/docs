FROM node:18-slim
WORKDIR /src
COPY . /src
RUN yarn && yarn build-node
VOLUME ["/src"]
