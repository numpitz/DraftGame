#!/usr/bin/env bash
set -euo pipefail

# Legacy docker-compose (apt install docker.io) tips
export DOCKER_BUILDKIT="${DOCKER_BUILDKIT:-0}"
export COMPOSE_DOCKER_CLI_BUILD="${COMPOSE_DOCKER_CLI_BUILD:-0}"
export DOCKER_BUILDKIT=0
export COMPOSE_DOCKER_CLI_BUILD=0

# docker-compose 1.29 hates desktop credential helpers; disable them unless already configured.
export DOCKER_CONFIG="${DOCKER_CONFIG:-$HOME/.docker}"
mkdir -p "$DOCKER_CONFIG"
cat > "$DOCKER_CONFIG/config.json" <<'JSON'
{
  "credsStore": ""
}
JSON

# docker-compose 1.29.2 sometimes crashes when inspecting old containers
# built with BuildKit. Force-remove stale service containers before rebuild.
docker-compose rm -fs backend frontend >/dev/null 2>&1 || true

exec docker-compose up --build "$@"
