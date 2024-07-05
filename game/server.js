const express = require('express');
const http = require('http');
const socketIo = require('socket.io');
const path = require('path');

const app = express();
const server = http.createServer(app);
const io = socketIo(server);

let players = [];

app.use(express.static(path.join(__dirname, 'public')));

io.on('connection', (socket) => {
    console.log('New player connected');

    socket.on('join', (username) => {
        players.push({ id: socket.id, username });
        io.emit('player joined', players);
    });

    socket.on('chat message', (data) => {
        io.emit('chat message', data);
    });

    socket.on('disconnect', () => {
        players = players.filter(player => player.id !== socket.id);
        io.emit('player left', players);
    });
});

const PORT = process.env.PORT || 3000;
server.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);
});
