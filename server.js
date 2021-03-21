const express = require('express');
const http = require('http') ;
const socketio = require('socket.io');
const cors = require('cors');


const app = express();
const server = http.createServer(app);
const io = socketio(server);

const PORT = process.env.PORT || 5000;

let users = [];

app.use(cors());

const removeUser = (name) => {
  const index = users.findIndex((user) => user === name);

  if (index !== -1) return users.splice(index, 1)[0];
};

app.get('/', (req, res) => {
  res.send('Hello world');
});

io.sockets.on('connection', (socket) => {
  console.log('A user has connected');

  socket.on(
    'message',
    ({ message, username }) => {
      io.emit('chatMessage', { message, username });
    },
  );

  socket.on('join', (username) => {
    socket.username = username;
    users.push(socket.username);
    io.emit('users', users);

    // send message to everyone, except source
    socket.broadcast.emit('chatMessage', {
      message: `${username} has joined!`,
      username: 'System',
    });
  });

  socket.on('disconnect', () => {
    console.log('A user has disconnected');
    const user = removeUser(socket.username);

    socket.broadcast.emit('chatMessage', { message: `${user} has left!` });
  });
});

server.listen(PORT, () => {
  console.log('Server running on localhost port: ', PORT);
});
