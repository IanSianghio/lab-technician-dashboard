import express from 'express';
import { createServer } from 'http';
import { Server } from 'socket.io';
import cors from 'cors';

const app = express();
const httpServer = createServer(app);

// Allow our Vite frontend to connect to this Socket.io server
const io = new Server(httpServer, {
  cors: {
    origin: '*', // For development, allow any origin
    methods: ['GET', 'POST']
  }
});

// Middleware to parse incoming JSON
app.use(express.json());
app.use(cors());

// Health check endpoint
app.get('/api/health', (req, res) => {
  res.json({ status: 'Backend is running' });
});

// This is the endpoint the Raspberry Pi will hit
// Example payload: { "battery": 80 }
app.post('/api/robot-status', (req, res) => {
  const data = req.body;
  
  console.log('Received data from Raspberry Pi:', data);

  // Instantly broadcast the data to the React dashboard via WebSockets
  io.emit('robot-status-update', data);

  res.status(200).json({ message: 'Data received and broadcasted successfully' });
});

io.on('connection', (socket) => {
  console.log('Dashboard connected via WebSockets:', socket.id);
  
  socket.on('disconnect', () => {
    console.log('Dashboard disconnected:', socket.id);
  });
});

const PORT = 3001;
httpServer.listen(PORT, '0.0.0.0', () => {
  console.log(`Backend server listening on port ${PORT}`);
  console.log(`Waiting for Raspberry Pi data at POST http://localhost:${PORT}/api/robot-status`);
});
