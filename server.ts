import express, { Request, Response } from 'express';
import http from 'http';
import { Server, Socket } from 'socket.io';
import cors from 'cors';

const app = express();
const server = http.createServer(app);
const io = new Server(server);

let users: any[] = [];

app.use(cors());

const removeUser = (name: string) => {
  const index = users.findIndex((user) => user === name);

  if (index !== -1) return users.splice(index, 1)[0];
};

app.get('/', (req: Request, res: Response) => {
  res.send('Hello world');
});

io.sockets.on('connection', (socket: any) => {
  console.log('A user has connected');

  socket.on(
    'message',
    ({ message, username }: { message: string; username: string }) => {
      io.emit('chatMessage', { message, username });
    },
  );

  socket.on('join', (username: string) => {
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

server.listen(4000, () => {
  console.log('Server running on localhost port 5000');
});
