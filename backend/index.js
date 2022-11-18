const express = require('express');
const fs = require('fs');
const https = require('https');
const cors = require('cors');

const options = {
  key: fs.readFileSync('./file.pem'),
  cert: fs.readFileSync('./file.crt')
};

const app = express();
const httpsServer = https.createServer(options, app);
const io = require('socket.io')(httpsServer, {
  cors: {
    origin: '*',
    methods: ['GET', 'POST'],
  },
});

const chat = [
  {
    id: 0,
    messages: [],
    users: [],
  }
];

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

httpsServer.listen(4001, '192.168.1.79', () => {
  console.log('listening');
});
