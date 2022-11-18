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

const chat = [{
  id: 0,
  messages: [],
  users: [],
}];

const users = [];

const corsOptions = {
  origin: '*',
  credentials: true,
  optionSuccessStatus: 200,
};

app.use(cors(corsOptions));

app.get('/', (_, res) => {
  res.json(chat);
});

io.on('connection', (socket) => {
  console.log('connected user %s', socket.id);

  socket.on('message', ({ message, chatId }) => {
    console.log('new message: %s', message);
    chat[chatId].messages.push(message);
    io.emit('message', { message: message, chatId: chatId });
  });

  socket.on('user', (newUser) => {
    io.emit('user', newUser);
    let alreadyLogged = false;
    users.map(user => {
      if (user.name === newUser.name) {
        alreadyLogged = true;
      }
    });
    if (!alreadyLogged) {
      users.push(newUser);
      chat[0].users.push(newUser);
    }
  })

  socket.on('disconnect', () => {
    console.log(`user ${socket.id} disconnected`);
  });
});

httpServer.listen(4001, '192.168.1.79', () => {
  console.log('listening');
});
