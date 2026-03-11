#!/usr/bin/env bash

set -e

IMAGE_NAME="teras"
TAG=$(date +"%Y%d%m-%H%M")

echo "Building Docker image: ${IMAGE_NAME}:${TAG}"

docker build -t "${IMAGE_NAME}:${TAG}" .

echo "Build complete: ${IMAGE_NAME}:${TAG}"
