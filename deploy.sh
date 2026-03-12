#!/usr/bin/env bash

set -e

echo "=== Teras Deployment Script ==="
echo ""

# Step 1: Clone repository to tmp directory
TMP_DIR="/tmp/teras-deploy-$(date +%s)"
REPO_URL="https://github.com/BlankOn/Teras.git"

echo "Step 1/3: Cloning repository to ${TMP_DIR}..."
git clone --depth 1 "${REPO_URL}" "${TMP_DIR}"
cd "${TMP_DIR}"
echo "✓ Repository cloned successfully"
echo ""

# Step 2: Build Docker image
IMAGE_NAME="ghcr.io/blankon/teras-website"
TAG=$(date +"%Y%m%d-%H%M")

echo "Step 2/4: Building Docker image: ${IMAGE_NAME}:${TAG}..."
docker build --no-cache -t "${IMAGE_NAME}:${TAG}" -t "${IMAGE_NAME}:latest" .
echo "✓ Docker image built successfully"
echo ""

# Step 3: Update docker-compose.yaml with new tag
COMPOSE_FILE=~/docker-compose.yaml

echo "Step 3/4: Updating docker-compose.yaml with new tag..."
if [ -f "${COMPOSE_FILE}" ]; then
    sed -i.bak "s|image: ghcr.io/blankon/teras-website:.*|image: ${IMAGE_NAME}:${TAG}|g" "${COMPOSE_FILE}"
    echo "✓ Updated docker-compose.yaml with tag: ${TAG}"
else
    echo "⚠ Warning: ${COMPOSE_FILE} not found, skipping tag update"
fi
echo ""

# Step 4: Deploy with docker-compose
echo "Step 4/4: Deploying with docker-compose..."
cd ~/
docker compose up -d
echo "✓ Deployment complete"
echo ""

# Clean up
echo "Cleaning up temporary directory..."
rm -rf "${TMP_DIR}"
echo "✓ Cleanup complete"
echo ""

echo "=== Deployment Successful ==="
echo "Container is now running. Check status with: docker compose ps"
