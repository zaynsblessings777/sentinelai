import { useState, useEffect } from "react";
import { RadialBarChart, RadialBar } from "recharts";

const FONTS = `
  @import url('https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600&family=JetBrains+Mono:wght@400;600;700&display=swap');
`;

function getAccentColor(value, metric) {
  if (metric === "cpu") {
    if (value > 85) return "#FF3B57";
    if (value > 60) return "#F5A623";
    return "#00D4FF";
  }
  if (metric === "ram") {
    if (value > 90) return "#FF3B57";
    if (value > 70) return "#F5A623";
    return "#A78BFA";
  }
  if (metric === "disk") {
    if (value > 90) return "#FF3B57";
    if (value > 75) return "#F5A623";
    return "#34D399";
  }
  return "#00D4FF";
}

function GaugeCard({ label, value, metric }) {
  const color = getAccentColor(value, metric);
  const data = [{ name: label, value, fill: color }];
  const glowIntensity = Math.max(0, (value - 30) / 70);

  return (
    <div style={{
      background: "#12151C",
      border: "1px solid #1E2330",
      borderRadius: "16px",
      padding: "24px 20px 20px",
      display: "flex",
      flexDirection: "column",
      alignItems: "center",
      width: "200px",
      position: "relative",
      boxShadow: `0 0 ${20 + glowIntensity * 40}px ${color}${Math.round(glowIntensity * 40).toString(16).padStart(2, "0")}`,
      transition: "box-shadow 1s ease",
    }}>
      <span style={{
        fontFamily: "'Inter', sans-serif",
        fontSize: "11px",
        fontWeight: 600,
        letterSpacing: "0.12em",
        textTransform: "uppercase",
        color: "#4A5568",
        marginBottom: "4px",
      }}>{label}</span>

      <div style={{ position: "relative" }}>
        <RadialBarChart
          width={160}
          height={160}
          innerRadius="65%"
          outerRadius="100%"
          data={data}
          startAngle={220}
          endAngle={-40}
          barSize={10}
        >
          <RadialBar dataKey="value" max={100} background={{ fill: "#1E2330" }} cornerRadius={5} />
        </RadialBarChart>

        {/* Center value */}
        <div style={{
          position: "absolute",
          top: "50%",
          left: "50%",
          transform: "translate(-50%, -50%)",
          textAlign: "center",
          pointerEvents: "none",
        }}>
          <span style={{
            fontFamily: "'JetBrains Mono', monospace",
            fontSize: "26px",
            fontWeight: 700,
            color: color,
            lineHeight: 1,
            transition: "color 1s ease",
          }}>{value}</span>
          <span style={{
            fontFamily: "'JetBrains Mono', monospace",
            fontSize: "13px",
            color: "#4A5568",
            display: "block",
          }}>%</span>
        </div>
      </div>
    </div>
  );
}

function StatPill({ label, value, icon }) {
  return (
    <div style={{
      background: "#12151C",
      border: "1px solid #1E2330",
      borderRadius: "12px",
      padding: "14px 20px",
      display: "flex",
      flexDirection: "column",
      gap: "6px",
      minWidth: "150px",
    }}>
      <span style={{
        fontFamily: "'Inter', sans-serif",
        fontSize: "10px",
        fontWeight: 600,
        letterSpacing: "0.1em",
        textTransform: "uppercase",
        color: "#4A5568",
      }}>{icon} {label}</span>
      <span style={{
        fontFamily: "'JetBrains Mono', monospace",
        fontSize: "15px",
        fontWeight: 600,
        color: "#CBD5E0",
      }}>{value}</span>
    </div>
  );
}

function CoreBar({ index, value }) {
  const color = getAccentColor(value, "cpu");
  return (
    <div style={{ display: "flex", flexDirection: "column", gap: "5px", flex: 1, minWidth: "48px" }}>
      <div style={{
        height: "60px",
        background: "#1E2330",
        borderRadius: "6px",
        display: "flex",
        alignItems: "flex-end",
        overflow: "hidden",
      }}>
        <div style={{
          width: "100%",
          height: value + "%",
          background: color,
          borderRadius: "4px",
          transition: "height 0.8s ease, background 1s ease",
          boxShadow: value > 60 ? "0 0 8px " + color + "99" : "none",
        }} />
      </div>
      <span style={{
        fontFamily: "'JetBrains Mono', monospace",
        fontSize: "10px",
        color: "#4A5568",
        textAlign: "center",
      }}>C{index}</span>
      <span style={{
        fontFamily: "'JetBrains Mono', monospace",
        fontSize: "11px",
        color: color,
        textAlign: "center",
        transition: "color 1s ease",
      }}>{value}%</span>
    </div>
  );
}

function App() {
  const [metrics, setMetrics] = useState({
    cpu_percent: 0, cpu_per_core: [], ram_percent: 0, disk_percent: 0,
    net_sent_mb: 0, net_recv_mb: 0, battery_percent: null,
    battery_plugged: null, process_count: 0, uptime: "",
  });

  const [connected, setConnected] = useState(false);

  useEffect(() => {
    const ws = new WebSocket("ws://127.0.0.1:8000/ws/metrics");
    ws.onopen = () => setConnected(true);
    ws.onmessage = (event) => {
      const data = JSON.parse(event.data);
      setMetrics(data);
    };
    ws.onerror = () => setConnected(false);
    ws.onclose = () => setConnected(false);
    return () => ws.close();
  }, []);

  const batteryText = metrics.battery_percent !== null
    ? metrics.battery_percent + "%" + (metrics.battery_plugged ? " charging" : " on battery")
    : "N/A";

  return (
    <>
      <style>{FONTS}</style>
      <style>{`
        * { box-sizing: border-box; margin: 0; padding: 0; }
        body { background: #0A0C10; }
        ::-webkit-scrollbar { width: 4px; }
        ::-webkit-scrollbar-track { background: #0A0C10; }
        ::-webkit-scrollbar-thumb { background: #1E2330; border-radius: 2px; }
      `}</style>

      <div style={{
        background: "#0A0C10",
        minHeight: "100vh",
        fontFamily: "'Inter', sans-serif",
        padding: "32px",
        display: "flex",
        flexDirection: "column",
        gap: "24px",
        maxWidth: "960px",
        margin: "0 auto",
      }}>

        {/* Header */}
        <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between" }}>
          <div>
            <h1 style={{
              fontFamily: "'JetBrains Mono', monospace",
              fontSize: "20px",
              fontWeight: 700,
              color: "#E2E8F0",
              letterSpacing: "-0.02em",
            }}>
              SENTINEL<span style={{ color: "#00D4FF" }}>AI</span>
            </h1>
            <p style={{
              fontSize: "11px",
              color: "#4A5568",
              letterSpacing: "0.08em",
              textTransform: "uppercase",
              marginTop: "2px",
            }}>System Monitor</p>
          </div>

          <div style={{ display: "flex", alignItems: "center", gap: "8px" }}>
            <div style={{
              width: "7px",
              height: "7px",
              borderRadius: "50%",
              background: connected ? "#34D399" : "#FF3B57",
              boxShadow: connected ? "0 0 8px #34D39988" : "0 0 8px #FF3B5788",
            }} />
            <span style={{
              fontFamily: "'JetBrains Mono', monospace",
              fontSize: "11px",
              color: connected ? "#34D399" : "#FF3B57",
            }}>{connected ? "LIVE" : "OFFLINE"}</span>
          </div>
        </div>

        {/* Gauge row */}
        <div style={{ display: "flex", gap: "20px", flexWrap: "wrap" }}>
          <GaugeCard label="CPU" value={metrics.cpu_percent} metric="cpu" />
          <GaugeCard label="RAM" value={metrics.ram_percent} metric="ram" />
          <GaugeCard label="Disk" value={metrics.disk_percent} metric="disk" />
        </div>

        {/* Stat pills */}
        <div style={{ display: "flex", gap: "12px", flexWrap: "wrap" }}>
          <StatPill label="Net Sent" value={metrics.net_sent_mb + " MB"} icon="↑" />
          <StatPill label="Net Recv" value={metrics.net_recv_mb + " MB"} icon="↓" />
          <StatPill label="Battery" value={batteryText} icon="⚡" />
          <StatPill label="Processes" value={metrics.process_count} icon="◈" />
          <StatPill label="Uptime" value={metrics.uptime} icon="◷" />
        </div>

        {/* Per-core bars */}
        {metrics.cpu_per_core.length > 0 && (
          <div style={{
            background: "#12151C",
            border: "1px solid #1E2330",
            borderRadius: "16px",
            padding: "20px",
          }}>
            <span style={{
              fontFamily: "'Inter', sans-serif",
              fontSize: "10px",
              fontWeight: 600,
              letterSpacing: "0.12em",
              textTransform: "uppercase",
              color: "#4A5568",
              display: "block",
              marginBottom: "16px",
            }}>Per-Core CPU</span>
            <div style={{ display: "flex", gap: "10px" }}>
              {metrics.cpu_per_core.map((core, i) => (
                <CoreBar key={i} index={i} value={core} />
              ))}
            </div>
          </div>
        )}

      </div>
    </>
  );
}

export default App;