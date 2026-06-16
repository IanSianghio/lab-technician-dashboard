# LabGuard — Lab Technician Dashboard

A real-time monitoring dashboard for a lab environment. It displays live data from a Roomba robot and an OAK-D camera, streamed from a Raspberry Pi to a React frontend via a Node.js/Socket.io backend.

---

## System Architecture

```
Roomba  →  Arduino (serial bridge)  →  Raspberry Pi  →  POST /api/robot-status  →  Node.js Backend  →  Socket.io  →  React Dashboard
OAK-D Camera                        →  Raspberry Pi  →  MJPEG stream (:5000)    →  React Dashboard (CameraFeed)
```

- **Mac / Dev machine** — runs the React frontend (port `5173`) and Node.js backend (port `3001`)
- **Raspberry Pi** — runs two Python scripts: one for Roomba serial data, one for the OAK-D camera stream
- **Arduino** — acts as a dumb USB-to-serial bridge between the Roomba's OI port and the Pi

See [ROBOTICS_SETUP.md](./ROBOTICS_SETUP.md) for full hardware wiring details and the Python scripts.

---

## Prerequisites

- Node.js 18+
- npm

---

## Getting Started

```bash
# 1. Clone the repo
git clone https://github.com/IanSianghio/lab-technician-dashboard.git
cd lab-technician-dashboard

# 2. Install dependencies
npm install

# 3. Start everything (frontend + backend together)
npm run dev
```

This runs `concurrently`:
- **Vite** dev server → `http://localhost:5173`
- **Node.js backend** → `http://localhost:3001`

Open `http://localhost:5173` in your browser. The dashboard will load with mock data by default — live data flows in once the Raspberry Pi scripts are running.

---

## Project Structure

```
lab-technician-dashboard/
├── backend/
│   └── server.js              # Express + Socket.io server (port 3001)
├── src/
│   ├── App.jsx                # Root — Socket.io connection, tab routing
│   ├── context/
│   │   └── DashboardContext.jsx  # Global state (useReducer)
│   ├── data/
│   │   └── mockData.js        # Default mock values shown before live data
│   ├── components/
│   │   ├── alerts/            # Alert panel, filters, detail drawer
│   │   ├── camera/            # OAK-D MJPEG feed (CameraFeed.jsx)
│   │   ├── control/           # Control panel (patrol, e-stop, threshold)
│   │   ├── environmental/     # Temp/humidity/pressure monitor
│   │   ├── export/            # Detection log table + CSV export
│   │   ├── map/               # 2D SVG lab map with robot position
│   │   ├── metrics/           # YOLO performance metrics + charts
│   │   └── robot/             # RobotStatusPanel (battery, state, sensors)
│   └── utils/
│       └── helpers.js
├── ROBOTICS_SETUP.md          # Hardware wiring + Pi Python scripts
└── package.json
```

---

## Backend API

The Node.js backend exposes one POST endpoint that the Raspberry Pi hits. It immediately broadcasts the payload to all connected dashboard clients via Socket.io.

### `POST /api/robot-status`

Send any subset of these fields — the dashboard merges them into the current state:

```json
{
  "battery":         80,           // number, 0–100 (%)
  "state":           "Patrolling", // "Patrolling" | "Charging" | "Idle" | "Error"
  "speed":           0.3,          // number, m/s
  "latency":         42,           // number, ms
  "currentWaypoint": 3,            // number
  "totalWaypoints":  10,           // number
  "coverage":        65,           // number, %
  "camera":          "Connected",  // string
  "slam":            "Active",     // string
  "platform":        "Online"      // string
}
```

The Socket.io event emitted to the frontend is `robot-status-update`.

### `GET /api/health`

Returns `{ "status": "Backend is running" }` — useful to confirm the server is up.

---

## Connecting the Pi

In `roomba_battery.py` on the Pi, update this line to point at your machine's local IP:

```python
DASHBOARD_URL = 'http://<YOUR_MAC_IP>:3001/api/robot-status'
```

Find your Mac's IP with `ipconfig getifaddr en0` (Wi-Fi) or `en1` (Ethernet).

---

## Scripts

| Command | What it does |
|---|---|
| `npm run dev` | Starts Vite frontend + Node backend together |
| `npm run server` | Starts only the Node backend |
| `npm run build` | Production build to `dist/` |
| `npm run lint` | Run ESLint |
