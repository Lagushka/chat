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
    const chatToPushIndex = chats.findIndex((chat) => (chat.id === chatId));
    chats[chatToPushIndex].messages.push(message);
    for (let i = chatToPushIndex; i > 0; i--) {
      const buffer = chats[i];
      chats[i] = chats[i-1];
      chats[i-1] = buffer;
    }
    io.emit('message', { message: message, chatId });
  });

  socket.on('user', (newUser) => {
    let alreadyLogged = false;
    users.forEach(user => {
      if (user.name === newUser.name) {
        alreadyLogged = true;
        user.socket = socket.id;
        user.online = true;
        io.emit('userStatusChange', { requiredUser: user, online: true });
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
    io.emit('newChat', newChat);
  })

  socket.on('disconnect', () => {
    console.log(`user ${socket.id} disconnected`);
    chats.forEach((chat) => {
      chat.users.forEach((user) => {
        if (user.socket === socket.id) {
          user.online = false;
          console.log('disc');
          io.emit('userStatusChange', { requiredUser: user, online: false });
        }
      })
    });
  });
});

httpServer.listen(4001, () => {
  console.log('listening');
});