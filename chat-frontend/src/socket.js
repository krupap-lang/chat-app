import { io } from 'socket.io-client';

const URL = 'http://localhost:3000';
// Initial socket instance without connecting immediately
export const socket = io('http://localhost:3000', {
  autoConnect: false,
});