import { io } from 'socket.io-client';
 
const socket = io(`http://${window.location.hostname}:3001`, {
  reconnectionAttempts: 10,
  reconnectionDelay:    1000,
});
 
export default socket;