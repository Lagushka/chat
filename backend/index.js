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

const chats = [
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
  res.json(chats);
});

io.on('connection', (socket) => {
  console.log('connected user %s', socket.id);

  socket.on('message', ({ message, chatId }) => {
    console.log('new message: %s', message);
    chats[chatId].messages.push(message);
    io.emit('message', { message: message, chatId: chatId });
  });

  socket.on('user', (newUser) => {
    io.emit('user', newUser);
    let alreadyLogged = false;
    users.map(user => {
      if (user.name === newUser.name) {
        alreadyLogged = true;
        user.socket = socket.id;
        user.online = true;
        io.emit('userOnline', user);
      }
    });
    if (!alreadyLogged) {
      users.push(newUser);
      chats.map(chatElement => {
        chatElement.users.push(newUser);
      });
      io.emit('newUser', newUser);
    }
  });

  socket.on('newChat', (newChat) => {
    newChat = {
      id: chats.length,
      name: newChat.name,
      messages: [],
      users: users,
    };
    chats.push(newChat);
    socket.emit('newChat', newChat);
  })

  socket.on('disconnect', () => {
    console.log(`user ${socket.id} disconnected`);
    chats.map((chat) => {
      chat.users.map((user) => {
        if (user.socket === socket.id) {
          user.online = false;
          console.log('disc');
          io.emit('userDisconnected', user);
        }
      })
    });
  });
});

httpServer.listen(4001, () => {
  console.log('listening');
});