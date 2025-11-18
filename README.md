# DraftGame

Sample full-stack playground that pairs a modern Angular 20 single-page application with a Rust/Axum API. Both services ship with MIT licensing and Docker recipes so you can spin them up locally or deploy them anywhere that speaks containers.

## Tech stack

- **Frontend**: Angular 20 standalone app, HttpClient + RxJS, modern CSS.
- **Backend**: Rust 1.78 with Axum 0.7, Tokio runtime, Tower HTTP middleware, structured logging via Tracing.
- **Runtime**: Docker images for each service plus a `docker-compose.yml` to orchestrate them.

## Repository layout

```
frontend/        # Angular workspace (npm scripts, Dockerfile, nginx proxy)
backend/         # Rust crate with Axum server and Dockerfile
docker-compose.yml
```

## Prerequisites

- Node.js 20+ and npm (if you want to run Angular outside of Docker)
- Rust toolchain (1.78+) via rustup
- Docker Desktop or compatible engine for container-based workflows

## Running locally without Docker

### Backend

```bash
cd backend
cargo run
```

The API listens on `http://localhost:8081` and exposes:

- `GET /api/healthz` – simple health probe
- `GET /api/drafts` – returns curated sample draft games

### Frontend

```bash
cd frontend
npm install
npm start
```

The dev server hosts the Angular UI at `http://localhost:8080` and proxies API calls to `http://localhost:8081/api`.

> Tip: the Angular environment files live under `src/environments`. Use `environment.ts` for local development and `environment.docker.ts` when building inside containers.

### Developer experience commands

- `npm run build` – compiles the Angular bundle to `dist/`.
- `npm test` – runs Karma/Jasmine specs (headless Chrome).
- `npm run start:docker` – convenient server config that mirrors the Docker settings (0.0.0.0 host + docker env file).
- `cargo fmt && cargo clippy` – format and lint the API crate.
- `cargo test` – run Rust unit/integration tests (currently only covering the sample endpoints).

When debugging the backend you can raise logging verbosity with `RUST_LOG=debug cargo run`.

## Running with Docker

```bash
docker compose up --build
```

On Debian/Ubuntu installs that use `apt install docker.io` (common inside WSL) the modern `docker compose` plugin is not enabled by default. In that case either install the official Docker packages (which ship the plugin) or use the legacy binary:

```bash
sudo apt install docker-compose        # if not already present
docker-compose up --build
```

If you see permission errors, add your user to the `docker` group with `sudo usermod -aG docker $USER` and restart the shell.

> Note: the repo ships a `.env` file that sets `DOCKER_BUILDKIT=0` and `COMPOSE_DOCKER_CLI_BUILD=0`. This works around a bug in the older `docker-compose` binary that `apt install docker.io` provides, ensuring builds produce the metadata Compose expects. Remove those lines once you upgrade to the newer `docker compose` plugin.

When using the legacy `docker-compose` binary, prefer the helper script which cleans up stale containers before starting:

```bash
./scripts/docker-up.sh
```

This command builds both images, starts the Axum API on port 8081, and serves the production Angular bundle via Nginx on port 8080. The Nginx config forwards `/api` traffic to the backend service so the browser never needs to know separate hosts.

### Docker image details

- `frontend/Dockerfile` – multi-stage build using Node 20 Alpine and nginx 1.25. Runtime exposes port 8080.
- `backend/Dockerfile` – Rust 1.78 Alpine builder, Debian slim runtime with non-root user on port 8081.
- `docker-compose.yml` – builds both images from source, wires the internal network, and publishes the default ports.

To run only one service:

```bash
docker compose up --build backend   # API only
docker compose up --build frontend  # Static bundle + proxy (expects backend service reachable at docker DNS name)
```

## Next steps

- Replace the placeholder draft data with persistence (PostgreSQL, SurrealDB, etc.).
- Add authentication/authorization if exposed on the public internet.
- Layer in unit/e2e tests (Jasmine/Karma, Vitest, Cypress, or Rust integration tests).

## Troubleshooting

- **Port already in use**: adjust the host binding in `docker-compose.yml` or run `npm start -- --port 4300`.
- **CORS errors in dev**: ensure the backend is reachable at `http://localhost:8081`; otherwise update `environment.ts`.
- **Slow Docker builds**: install dependencies once by caching `node_modules` into a volume or rely on local `npm run build` before containerizing.
