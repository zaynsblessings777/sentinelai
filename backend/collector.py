"""
collector.py — SentinelAI Week 1
Reads CPU, RAM, and disk metrics from your machine.
Run this file alone first to verify your readings work.
"""

import psutil
import time
import subprocess
import datetime

def _get_battery_percent():
    try:
        out = subprocess.check_output(["pmset", "-g", "batt"]).decode()
        for line in out.splitlines():
            if "%" in line:
                return int(line.strip().split("%")[0].split()[-1])
    except:
        return None

def _get_battery_plugged():
    try:
        out = subprocess.check_output(["pmset", "-g", "batt"]).decode()
        return "AC Power" in out
    except:
        return None


def get_metrics() -> dict:
    """
    Returns a single snapshot of system metrics.
    cpu_percent   : 0–100, how busy your CPU is right now
    ram_percent   : 0–100, how much RAM is in use
    disk_percent  : 0–100, how full your main disk is
    ram_used_gb   : RAM used in gigabytes (human-readable)
    ram_total_gb  : Total RAM in gigabytes
    timestamp     : Unix timestamp of the reading
    """
    ram = psutil.virtual_memory()
    disk = psutil.disk_usage("/")
    net = psutil.net_io_counters()

    return {
        "cpu_percent":   psutil.cpu_percent(interval=1),
        "cpu_per_core": psutil.cpu_percent(interval=0, percpu=True),
        "ram_percent":   ram.percent,
        "disk_percent":  disk.percent,
        "net_sent_mb": round(net.bytes_sent / (1024 ** 2), 2),
        "net_recv_mb": round(net.bytes_recv / (1024 ** 2), 2),
        "ram_used_gb":   round(ram.used  / (1024 ** 3), 2),
        "ram_total_gb":  round(ram.total / (1024 ** 3), 2),
        "timestamp":     time.time(),
        "battery_percent": _get_battery_percent(),
        "battery_plugged": _get_battery_plugged(),
        "process_count": len(psutil.pids()),
        "uptime": str(datetime.timedelta(seconds=int(time.time() - psutil.boot_time()))),
    }


if __name__ == "__main__":
    # Run this file directly to test: python collector.py
    print("SentinelAI — live metrics (Ctrl+C to stop)\n")
    print(f"{'CPU %':>8}  {'RAM %':>8}  {'Disk %':>8}  {'RAM Used':>12}")
    print("-" * 48)

    while True:
        m = get_metrics()
        print(
            f"{m['cpu_percent']:>7.1f}%"
            f"  {m['ram_percent']:>7.1f}%"
            f"  {m['disk_percent']:>7.1f}%"
            f"  {m['ram_used_gb']:>5.2f} / {m['ram_total_gb']:.2f} GB"
        )
        time.sleep(2)
