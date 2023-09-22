const express = require('express');
/* eslint import/no-extraneous-dependencies:0 */
const cors = require('cors');

const corsOptions = { origin: ['http://localhost:3000', 'http://127.0.0.1:3000'] };

const PORT = process.env.PORT || 3001;

// Setting Up Socket
const socketIo = require('socket.io');

const app = express();
const http = require('http').Server(app);

const io = socketIo(http, {
  cors: {
    origin: corsOptions.origin,
  },
});
// ------ End of Setting Socket

// Using Middlewares
app.use(cors(corsOptions));

// Storage
const allUsers = [];

// Socket =======================
io.on('connection', (socket) => {
  console.log('Connected');

  socket.on('foo', (v) => console.log(v));

  socket.on('join_room', ({ username, roomName }) => {
    socket.join(roomName);

    // Storing Current ChatRoom Users
    if (!allUsers.find((itm) => itm.sockerId === socket.id)) {
      allUsers.push({ sockerId: socket.id, username, roomName });
    }
    const chatRoomUsers = allUsers.filter((usr) => usr.roomName === roomName);
    socket.to(roomName).emit('chatroom_users', chatRoomUsers);
    socket.emit('chatroom_users', chatRoomUsers);

    const createdtime = Date.now(); // Current timestamp
    // Send message to all users currently in the room, apart from the user that just joined
    socket.to(roomName).emit('receive_message', {
      message: `${username} has joined the chat room`,
      username,
      createdtime,
    });

    // Emitting as usual
    socket.emit('receive_message', {
      message: `Welcome ${username}`,
      username,
      createdtime,
    });
  });

  // On Disconnect
  socket.on('disconnect', () => {
    console.log('Disconnected');
  });
});

// END of Socket =======================

http.listen(PORT, () => { console.log(`SERVER is RUNNING at ${PORT}`); });
