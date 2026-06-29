"""
test_websocket.py — SentinelAI Week 1
Connects to the WebSocket and prints 5 readings, then exits.
Use this to confirm server.py is working before building the frontend.

Run the server first:
  uvicorn server:app --reload

Then in a second terminal:
  python test_websocket.py
"""

import asyncio
import json
import websockets


async def test():
    uri = "ws://127.0.0.1:8000/ws/metrics"
    print(f"Connecting to {uri} ...\n")

    async with websockets.connect(uri) as ws:
        for i in range(5):
            raw = await ws.recv()
            data = json.loads(raw)
            print(
                f"[{i+1}/5]  "
                f"CPU: {data['cpu_percent']:>5.1f}%  "
                f"RAM: {data['ram_percent']:>5.1f}%  "
                f"Disk: {data['disk_percent']:>5.1f}%"
            )

    print("\nAll good! WebSocket stream is working.")


asyncio.run(test())
