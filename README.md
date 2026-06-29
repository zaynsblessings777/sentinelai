# SentinelAI 🖥️

A real-time system monitoring dashboard built with FastAPI, WebSockets, and React.

## What it monitors
- CPU usage (overall + per core)
- RAM usage
- Disk usage
- Network sent & received
- Battery status
- Active processes
- System uptime

## Requirements
- Python 3.11
- Node.js & npm

## Setup

### 1. Clone the repo

git clone https://github.com/zaynsblessings777/sentinelai.git

### 2. Start the backend
cd sentinelai/backend

pip install fastapi uvicorn psutil websockets

uvicorn server:app --reload

### 3. Start the frontend

cd sentinelai/frontend

npm install

npm run dev


### 4. Open in browser

http://localhost:5173

