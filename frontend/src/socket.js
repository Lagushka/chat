import io from 'socket.io-client';

export const IPADDRESS = '172.21.129.215';
export const PORT = '4001';

export const socket = io(`${IPADDRESS}:${PORT}`);

socket.on('connect', () => {
  console.log('connected');
});

socket.on('disconnect', () => {
  console.log('disconnected');
});
