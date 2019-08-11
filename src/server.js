const express = require('express');
const app = express();
const http = require('http').Server(app);
const io = require('socket.io')(http);
const port = process.env.PORT || 5000;

app.use(express.static(__dirname + '/public'));

io.on('connection', (socket) => {
	io.emit('chat message', `${socket.id}, entrou na sala.`);

	socket.on('chat message', (msg) => {
		io.emit('chat message', `(${socket.id}): ${msg}`);
	});
});

http.listen(port, () => {
	console.log('listening on *:' + port);
});
