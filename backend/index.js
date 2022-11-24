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

const chat = [
  {
    id: 0,
    name: "Chat",
    messages: [],
    users: [],
  }
];

const users = [];

app.use(cors({
  origin: '*',
  credentials: true,
  optionSuccessStatus: 200,
}));

app.get('/', (_, res) => {
  console.log('user connected!');	
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
      chat.map(chatElement => {
        chatElement.users.push(newUser);
      })
    }
  });

  socket.on('newChat', (newChat) => {
    newChat = {
      id: chat.length,
      name: newChat.name,
      messages: [],
      users: [],
    };
    chat.push(newChat);
    socket.emit('newChat', newChat);
  })

  socket.on('disconnect', () => {
    console.log(`user ${socket.id} disconnected`);
  });
});

httpServer.listen(4001, () => {
  console.log('listening');
});