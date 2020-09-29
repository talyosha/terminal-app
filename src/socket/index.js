import io from 'socket.io-client';

const ENDPOINT = 'localhost:3003';
const socket = io(ENDPOINT);

export const joinSocket = (authData) => {
  socket.emit('join', authData, () => {
    console.log('SOCKET JOINED');
  });
};

export const disconnectSocket = () => {
  socket.emit('disconnect');
};

export const sendCommand = (obj) => {
  socket.emit('command', obj);
};

export const listenSocket = (action, callback) => {
  socket.on(action, callback);
};
