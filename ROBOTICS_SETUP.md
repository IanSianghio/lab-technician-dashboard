# Roomba & OAK-D Dashboard Setup Guide

This document explains how the entire system is wired together and provides the exact steps to start everything up from scratch.

## 1. System Architecture
- **Mac (Dashboard & Backend):** Runs the React web app and a Node.js backend server. It receives data from the Pi over Wi-Fi and displays it.
- **Raspberry Pi:** Acts as the network bridge and heavy lifter. It runs two Python scripts simultaneously: one for streaming the OAK-D camera and one for reading the Roomba's serial data.
- **Arduino:** Acts purely as a "Dumb Wire" (USB-to-Serial converter) to safely bridge the Roomba's 5V serial interface to the Raspberry Pi's USB port.

---

## 2. Hardware Wiring Checklist

**Arduino Configuration:**
- Connect a jumper wire between the Arduino's **`RESET`** pin and its **`GND`** pin. (This disables the Arduino processor, turning it into a pure USB adapter).
- Plug the Arduino into the Raspberry Pi using a USB cable.

**Roomba Wiring (O/I Port):**
- Roomba **TX** $\rightarrow$ Arduino **TX (Pin 1)**
- Roomba **RX** $\rightarrow$ Arduino **RX (Pin 0)**
- Roomba **GND** $\rightarrow$ Arduino **GND**

**Camera:**
- Plug the OAK-D camera directly into the Raspberry Pi via USB-C.

---

## 3. How to Start the System

You must start the system in two parts: the Mac (Dashboard) and the Raspberry Pi (Scripts).

### Part A: Start the Mac Dashboard
1. Open your terminal on the Mac and navigate to the `lab-technician-dashboard` folder.
2. Run the following command:
   ```bash
   npm run dev
   ```
   *(This command runs `concurrently` to start BOTH the Vite frontend on port `5173` and the Node backend on port `3001` automatically).*
3. Open your browser to `http://localhost:5173`.

### Part B: Start the Raspberry Pi Scripts
SSH into your Raspberry Pi and open **two separate terminal windows**.

**Terminal 1 (The Camera Feed):**
Run the DepthAI v3 streaming script:
```bash
python3 stream.py
```
*(If you downgraded to DepthAI v2 earlier, use the v2 script instead. This will start an MJPEG stream on port `5000`)*.

**Terminal 2 (The Battery Status):**
Run the Roomba battery script:
```bash
python3 roomba_battery.py
```

---

## 4. The Python Scripts (For Reference)

In case you ever lose them, here are the two scripts that live on your Raspberry Pi:

### `roomba_battery.py`
```python
import serial
import time
import requests

ARDUINO_PORT = '/dev/ttyACM0' # Verify this using 'ls /dev/tty*' on the Pi
BAUD_RATE = 115200
DASHBOARD_URL = 'http://10.50.82.194:3001/api/robot-status'

def main():
    print("Connecting to Roomba directly via Pi...")
    with serial.Serial(ARDUINO_PORT, BAUD_RATE, timeout=1) as roomba:
        # Wake up / Passive Mode
        roomba.write(bytes([128])) 
        time.sleep(0.5)
        
        while True:
            # Request Battery Charge (Opcode 142, Packet 21)
            roomba.write(bytes([142, 21]))
            time.sleep(0.1) 
            
            if roomba.in_waiting >= 2:
                response = roomba.read(2)
                battery_charge = (response[0] << 8) | response[1]
                
                # Convert raw mAh to an approximate percentage (Max capacity ~2700 mAh)
                # Adjust '2700' based on your Roomba's actual battery size!
                battery_pct = min(100, int((battery_charge / 2700.0) * 100))
                
                print(f"Battery: {battery_charge} mAh ({battery_pct}%)")
                
                try:
                    requests.post(DASHBOARD_URL, json={"battery": battery_pct}, timeout=2)
                    print("Sent to dashboard!")
                except Exception as e:
                    print(f"Network error: {e}")
                    
            roomba.reset_input_buffer()
            time.sleep(2)

if __name__ == '__main__':
    main()
```

### `stream.py` (DepthAI v3 Version)
```python
import depthai as dai
import cv2
from flask import Flask, Response
import threading
import time

app = Flask(__name__)

pipeline = dai.Pipeline()
camRgb = pipeline.create(dai.node.ColorCamera)
camRgb.setBoardSocket(dai.CameraBoardSocket.CAM_A)
camRgb.setResolution(dai.ColorCameraProperties.SensorResolution.THE_1080_P)
camRgb.setInterleaved(False)
camRgb.setColorOrder(dai.ColorCameraProperties.ColorOrder.BGR)

videoQueue = camRgb.video.createOutputQueue(maxSize=1, blocking=False)
latest_frame = None

def capture_loop():
    global latest_frame
    pipeline.start()
    while True:
        in_video = videoQueue.tryGet()
        if in_video is not None:
            frame = in_video.getCvFrame()
            ret, buffer = cv2.imencode('.jpg', frame)
            latest_frame = buffer.tobytes()
        else:
            time.sleep(0.01)

t = threading.Thread(target=capture_loop, daemon=True)
t.start()

def generate_frames():
    global latest_frame
    while True:
        if latest_frame is not None:
            yield (b'--frame\r\n'
                   b'Content-Type: image/jpeg\r\n\r\n' + latest_frame + b'\r\n')
        time.sleep(0.03)

@app.route('/video_feed')
def video_feed():
    return Response(generate_frames(), mimetype='multipart/x-mixed-replace; boundary=frame')

if __name__ == '__main__':
    app.run(host='0.0.0.0', port=5000, debug=False, threaded=True)
```
