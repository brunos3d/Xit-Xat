const express = require('express');
const app = express();
const http = require('http').Server(app);
const io = require('socket.io')(http);
const port = process.env.PORT || 5000;

app.use(express.static(__dirname + '/public'));

var conectedUsers = {};
var conectedUsersCount = 0;
const names = ['Tokio', 'Rio', 'Nairóbi', 'Berlim', 'Moscou', 'Denver', 'Helsinque'];

io.on('connection', (socket) => {
	const username = names[conectedUsersCount++ % names.length];
	const user = { username, id: socket.id };
	conectedUsers[socket.id] = user;

	io.emit('new user', user);

	socket.on('chat message', (msg) => {
		io.emit('chat message', `(${conectedUsers[socket.id].username}): ${msg}`);
	});
});

http.listen(port, () => {
	console.log('listening on *:' + port);
});
