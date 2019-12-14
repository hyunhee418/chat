const socketIo = require('socket.io');
const express = require('express');
const http = require('http');
const fs = require('fs');

const app = express();
const server = http.createServer(app);
const io = socketIo.listen(server);

app.use(express.static(`${__dirname}/static`));

app.get('/', function(request, response) { 
    fs.readFile('./static/index.html', function (err, data) {
        if (err) {
            response.send(err)
        } else {
            response.writeHead(200, {'Content-Type': 'text/html'})
            response.write(data)
            response.end()
        };
    });
});

io.sockets.on('connection', (socket) => {
    let roomName=null;

    socket.on('join', (data) => {
        roomName = data.roomName;
        socket.join(data.roomName);
        io.sockets.in(roomName).emit('join', data)
    });

    socket.on('newUser', function(name) {
        console.log(name+' 님이 접속하였습니다.')
        socket.name = name
        io.sockets.in(roomName).emit('message', {type:'connect', name:'Sever', message: name + ' 님이 접속하였습니다.'})
    });

    socket.on('message', (data) => {
        data.name = socket.name
        io.sockets.in(roomName).emit('message', data)
    });

    socket.on('disconnect', function() {
        console.log(socket.name + '님이 나가셨습니다.')
        io.sockets.in(roomName).emit('message', {type:'disconnet', name: 'SERVER', message: socket.name + ' 님이 나가셨습니다.'})
    });
})

server.listen(52273, () => {
    console.log('Server Running at http://127.0.0.1:52273');
});