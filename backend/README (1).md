# SentinelAI — Week 1: Python Backend

Real-time system monitor with AI spike prediction.

---

## Project structure

```
sentinelai/
└── backend/
    ├── collector.py        ← reads CPU / RAM / disk metrics
    ├── server.py           ← FastAPI server (REST + WebSocket)
    ├── test_websocket.py   ← verifies the WS stream works
    └── requirements.txt
```

---

## Setup (do this once)

```bash
cd sentinelai/backend
pip install -r requirements.txt
```

---

## Step 1 — test the collector

```bash
python collector.py
```

You should see live CPU/RAM/disk readings printing every 2 seconds.
Press Ctrl+C to stop.

---

## Step 2 — start the server

```bash
uvicorn server:app --reload
```

Open these in your browser:
- http://127.0.0.1:8000/             → confirms server is alive
- http://127.0.0.1:8000/metrics      → one JSON snapshot
- http://127.0.0.1:8000/docs         → auto-generated API docs (FastAPI magic)

---

## Step 3 — test the WebSocket

Open a second terminal (keep the server running):

```bash
python test_websocket.py
```

You should see 5 live readings arrive over WebSocket, then exit.
If this works, Week 1 is complete.

---

## What you learned this week

| Concept | Where |
|---|---|
| Reading OS metrics from Python | `collector.py` |
| Returning data as JSON from an API | `GET /metrics` in `server.py` |
| Streaming data live over WebSocket | `WS /ws/metrics` in `server.py` |
| Async Python (`async/await`) | `websocket_metrics()` function |
| Auto-generated API docs | `/docs` — free with FastAPI |

---

## Week 2 preview

You'll build the HTML + JavaScript frontend that connects to `/ws/metrics`
and renders the data as live charts using Chart.js.
