#!/usr/bin/env bash
cd "$(dirname "$0")"
date

echo "## Crash on errors and unset variables ##"
set -e
set -u

IMAGE_NAME="vocabtrainer"
CONTAINER_NAME="vocabtrainer"
PORTS="51337:51337"

docker stop "$CONTAINER_NAME" || true
docker rm "$CONTAINER_NAME" || true
docker build -t "$IMAGE_NAME" -f ./docker/Dockerfile .

docker run \
  -e "vocabtrainer_user=$VOCABTRAINER_USER" \
  -e "api_key=$VOCABTRAINER_API_KEY" \
  -e analytics_api_url="empty" \
  -e feedback_api_url="https://dev-bitmark-api.taskbase.com" \
  -e tenant_id=99 \
  -e PYTHONPATH="./src" \
  --name "$CONTAINER_NAME" \
  -p "$PORTS" \
  "$IMAGE_NAME" \
  uvicorn main:app --proxy-headers --host 0.0.0.0 --port 51337 --reload || true
