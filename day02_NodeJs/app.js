// 모듈 추출
const socketIo = require('socket.io');
const express = require('express');
const http = require('http');

// 객체 선언
const app = express(); // express 객체 생성
const server = http.createServer(app) // server 객체 생성
const io = socketIo.listen(server);   // socket에 server 넣기

// 미들웨어 설정
app.use(express.static(`${__dirname}/public`)); // public 폴더 열기


// 웹 소켓 설정
io.sockets.on('connection', (socket) => {  //io 객체에 sockets의 on 메서드에 connection을 연결하여 사용하는 것이 기본
    // 변수 선언
    let roomName=null;

    // 클라이언트 방에 배정
    socket.on('joinABCD', (data) => {
        roomName = data.roomName;  // join 될 때 roomName 생성
        socket.join(data.roomName);
    });

    // 클라이언트에서 데이터가 전달되면 배분
    socket.on('message', (data) => {
        io.sockets.in(roomName).emit('message', {   // message를 room에 속한 모두에게 보내기
            message:'From Server'
        })
    });
});

// 서버 실행
server.listen(52273, () => {
    console.log('Server Running at http://127.0.0.1:52273');
});