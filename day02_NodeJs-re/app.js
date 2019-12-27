// 설치한 모듈 불러오기
const socketIo = require('socket.io'); // socket.io의 역할 : 브라우저 종류에 상관없이 실시간 웹을 구현할 수 있도록 한 모듈
const express = require('express'); // express의 역할 : 웹서버를 쉽게 구축할 수 있게 하는 NodeJS의 프레임워크
const http = require('http'); // http의 역할 : 크라이언트와 통신하기 위한 웹서버 구축
const fs = require('fs'); // fs(filesystem)의 역할 : file 읽기, 쓰기, 예외처리 가능

// 객체 선언
const app = express();  // express 객체 생성
const server = http.createServer(app); // express http 서버 객체 생성
const io = socketIo.listen(server); // 생성된 서버를 socket.io에 바인딩 (클라이언트가 들어오기를 기다리는 중)

// 미들웨어 만들기
app.use(express.static(`${__dirname}/static`));

// GET 방식으로 경로에 접속하면 /static/index.html 파일을 읽어라
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

// 웹 소켓 설정 (접속이 일어났을 때)
io.sockets.on('connection', (socket) => {

    // 변수 선언
    let roomName = null;

    // 2. 클라이언트 방에 배정하기 (index.html에서 'join'이라는 소리 듣고 행동하자!)
    socket.on('join', (data) => {
        roomName = data.roomName;  // join 이라고 외치면서 보낸 roomName을 받기
        socket.join(data.roomName); // roomName으로 들어가자
        io.sockets.in(roomName).emit('join', data) // roomName 룸 내의 모든 클라이언트에 'join'을 송신
    });

    // 5. index.html에서 'newUser'라는 소리 듣고 행동 !
    socket.on('newUser', function(name) {
        console.log(name+' 님이 접속하였습니다.')
        socket.name = name // newUser라고 외치면서 보낸 사용자 이름
        io.sockets.in(roomName).emit('message', {type:'connect', name:'Sever', message: name + ' 님이 접속하였습니다.'})  // roomName 룸 내의 모든 클라이언트의 index.html에 'message'라고 외치면서 접속 데이터 보내기
    });

    // index.html에서 'message' 라고 외치면 행동
    socket.on('message', (data) => {
        // 일단 이름이 빈 상태로 왔으니까 이름 정해주자
        data.name = socket.name
        io.sockets.in(roomName).emit('message', data) // roomName 룸 내 모든 클라이언트 index.html에게 'message'라고 외치면서 송신하자
    });

    // index.html에서 'disconnect'라고 외치면 행동하자
    socket.on('disconnect', function() {
        console.log(socket.name + '님이 나가셨습니다.')
        socket.broadcast.in(roomName).emit('message', {type: 'disconnet', name: 'SERVER', message: socket.name + ' 님이 나가셨습니다.'})
        // roomName 룸 내 모든 클라이언트 index.html에게 'message'라고 외치면서 나간 데이터를 송신하자
    });
})

// 서버 실행
server.listen(52273, () => {
    console.log('Server Running at http://127.0.0.1:52273');
});