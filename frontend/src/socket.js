import io from 'socket.io-client';

export const IPADDRESS = 'http://chatbackend.std-1721.ist.mospolytech.ru';
// export const PORT = '4001';

export const socket = io(`${IPADDRESS}`);

socket.on('connect', () => {
  console.log('connected');
});

socket.on('disconnect', () => {
  console.log('disconnected');
});
