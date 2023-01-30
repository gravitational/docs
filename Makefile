DOCKER_IMAGE ?= quay.io/gravitational/next:main

# Commands for building the Docker image.
.PHONY: docker-pull
docker-pull:
	docker pull $(DOCKER_IMAGE) || true

.PHONY: docker-image
docker-image: docker-pull
	docker build \
		--cache-from $(DOCKER_IMAGE) \
		-t $(DOCKER_IMAGE) .

.PHONY: docker-push
docker-push:
	docker push $(DOCKER_IMAGE)
