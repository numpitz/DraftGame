FROM rust:1.78-alpine AS build
WORKDIR /app
RUN apk add --no-cache musl-dev pkgconfig openssl-dev
COPY Cargo.toml ./
COPY src ./src
RUN cargo build --release

FROM debian:bookworm-slim AS runtime
RUN useradd -m -u 10001 appuser
WORKDIR /app
COPY --from=build /app/target/release/backend /usr/local/bin/backend
EXPOSE 8081
USER appuser
CMD ["backend"]
