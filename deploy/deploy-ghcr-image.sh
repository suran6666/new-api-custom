#!/usr/bin/env bash
set -euo pipefail

if [ $# -ne 1 ]; then
  echo "Usage: $0 ghcr.io/OWNER/new-api:TAG" >&2
  exit 2
fi

IMAGE="$1"
stamp="$(date +%Y%m%d%H%M%S)"
cd /opt/new-api

mkdir -p /opt/new-api/backups
cp -a docker-compose.yml "/opt/new-api/backups/docker-compose.yml.before-ghcr-${stamp}" 2>/dev/null || true
cp -a docker-compose.ghcr.yml "/opt/new-api/backups/docker-compose.ghcr.yml.before-${stamp}" 2>/dev/null || true
cp -a data/new-api.db "/opt/new-api/backups/new-api.db.before-ghcr-${stamp}" 2>/dev/null || true

echo "Pulling ${IMAGE} ..."
docker pull "${IMAGE}"

echo "Starting new-api with ${IMAGE} ..."
NEW_API_IMAGE="${IMAGE}" docker compose -p new-api -f /opt/new-api/docker-compose.ghcr.yml up -d

echo "Waiting for local health check ..."
for i in $(seq 1 30); do
  if curl -fsS --max-time 5 http://127.0.0.1:3000/api/status >/dev/null; then
    echo "OK: new-api is healthy"
    docker ps --filter name=new-api --format 'table {{.Names}}\t{{.Image}}\t{{.Status}}\t{{.Ports}}'
    exit 0
  fi
  sleep 2
done

echo "Health check failed; showing recent logs" >&2
docker logs --tail 80 new-api >&2 || true
exit 1
