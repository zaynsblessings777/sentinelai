"""
server.py — SentinelAI Week 1
FastAPI server with two routes:

  GET  /metrics          → returns one snapshot as JSON (REST)
  WS   /ws/metrics       → streams a new snapshot every 2 seconds (WebSocket)

Run with:
  uvicorn server:app --reload
Then open:
  http://127.0.0.1:8000/metrics        → see JSON in browser
  http://127.0.0.1:8000/docs           → auto-generated API docs (free with FastAPI!)
"""

import asyncio
import json
from fastapi import FastAPI, WebSocket, WebSocketDisconnect
from fastapi.middleware.cors import CORSMiddleware
from collector import get_metrics


# --- App setup -----------------------------------------------------------

app = FastAPI(
    title="SentinelAI",
    description="Real-time system monitor with AI predictions",
    version="1.0.0",
)

# Allow your frontend (any origin during development) to connect
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],   # Tighten this in production
    allow_methods=["*"],
    allow_headers=["*"],
)


# --- REST endpoint -------------------------------------------------------

@app.get("/metrics")
def read_metrics():
    """
    Returns a single metric snapshot right now.
    Great for testing — just open this URL in your browser.
    """
    return get_metrics()


@app.get("/")
def root():
    return {
        "message": "SentinelAI is running!",
        "endpoints": {
            "rest":      "GET  /metrics",
            "websocket": "WS   /ws/metrics",
            "docs":      "GET  /docs",
        }
    }


# --- WebSocket endpoint --------------------------------------------------

@app.websocket("/ws/metrics")
async def websocket_metrics(websocket: WebSocket):
    """
    Accepts a WebSocket connection and pushes a new metrics
    snapshot every 2 seconds until the client disconnects.

    The frontend (Week 2) will connect here.
    """
    await websocket.accept()
    print(f"[WS] Client connected: {websocket.client}")

    try:
        while True:
            data = get_metrics()
            await websocket.send_text(json.dumps(data))
            await asyncio.sleep(2)

    except WebSocketDisconnect:
        print(f"[WS] Client disconnected: {websocket.client}")
