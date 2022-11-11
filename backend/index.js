const express = require('express');
const http = require('http');
const cors = require('cors');

const app = express();
const httpServer = http.createServer(app);
const io = require('socket.io')(httpServer, {
  cors: {
    origin: '*',
    methods: ['GET', 'POST'],
  },
});

const messagesArray = [
  {
    id: 0,
    text: 'hello',
    sender: 'Lagushka',
  },
  {
    id: 1,
    text: 'well hello there',
    sender: 'De1phin',
  },
];

const corsOptions = {
  origin: '*',
  credentials: true,
  optionSuccessStatus: 200,
};

app.use(cors(corsOptions));

app.get('/', (_, res) => {
  res.json(messagesArray);
});

io.on('connection', (socket) => {
  console.log('connected user %s', socket.id);

  socket.on('message', (message) => {
    console.log('new message: %s', message);
    messagesArray.push(message);
    io.emit('message', message);
  });
});

httpServer.listen(4001, '192.168.1.79', () => {
  console.log('listening');
});
