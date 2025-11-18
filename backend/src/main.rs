use std::{net::SocketAddr, sync::Arc};

use axum::{extract::State, http::StatusCode, response::IntoResponse, routing::get, Json, Router};
use serde::Serialize;
use tower_http::{cors::{Any, CorsLayer}, trace::TraceLayer};
use tracing::{info, Level};

#[derive(Debug, Clone, Serialize)]
struct DraftGame {
    id: String,
    title: String,
    description: String,
    players: Vec<String>,
}

type AppState = Arc<Vec<DraftGame>>;

#[tokio::main]
async fn main() {
    init_tracing();

    let state = Arc::new(seed_games());

    let app = Router::new()
        .route("/api/healthz", get(health))
        .route("/api/drafts", get(list_drafts))
        .with_state(state)
        .layer(TraceLayer::new_for_http())
        .layer(
            CorsLayer::new()
                .allow_origin(Any)
                .allow_methods(Any)
                .allow_headers(Any),
        );

    let addr = SocketAddr::from(([0, 0, 0, 0], 8081));
    info!("listening on {}", addr);
    axum::serve(tokio::net::TcpListener::bind(addr).await.unwrap(), app)
        .await
        .unwrap();
}

fn init_tracing() {
    tracing_subscriber::fmt()
        .with_max_level(Level::INFO)
        .with_target(false)
        .init();
}

async fn health() -> impl IntoResponse {
    (StatusCode::OK, Json(serde_json::json!({ "status": "ok" })))
}

async fn list_drafts(State(state): State<AppState>) -> impl IntoResponse {
    Json(state.as_ref().clone())
}

fn seed_games() -> Vec<DraftGame> {
    vec![
        DraftGame {
            id: "draft-neo-tokyo".into(),
            title: "Neon Syndicate Showdown".into(),
            description: "Cyber ninjas draft augmented abilities to control Neo Tokyo.".into(),
            players: vec!["Shin".into(), "Rowan".into(), "Ivy".into()],
        },
        DraftGame {
            id: "draft-solstice".into(),
            title: "Solstice Arena".into(),
            description: "Mages bend time shards to outsmart their rivals.".into(),
            players: vec!["Adira".into(), "Luca".into()],
        },
    ]
}
