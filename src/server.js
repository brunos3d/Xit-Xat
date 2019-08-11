const express = require('express');
const app = express();
const http = require('http').Server(app);
const io = require('socket.io')(http);
const port = process.env.PORT || 5000;

app.use(express.static(__dirname + '/public'));

let connectedUsers = {};
let connectedUsersCount = 0;
const names = ['Tokio', 'Rio', 'Nairobi', 'Berlim', 'Palermo', 'Denver'];

io.on('connection', (socket) => {
	let username = names[connectedUsersCount++ % names.length];

	if (connectedUsersCount > names.length) {
		username += ` (${connectedUsersCount - names.length})`;
	}

	console.log(username, connectedUsersCount);

	const user = { username, id: socket.id };
	connectedUsers[socket.id] = user;

	socket.emit('set user', user);

	io.emit('user connected', user);

	io.emit('update online users', connectedUsersCount);

	io.emit('new user', user);

	socket.on('chat message', msg => {
		const user = connectedUsers[socket.id];
		io.emit('chat message', { user, msg });
	});

	socket.on('disconnect', () => {
		connectedUsersCount--;
		delete connectedUsers[socket.id];

		io.emit('user disconnected', user);

		io.emit('update online users', connectedUsersCount);
	});
});

http.listen(port, () => {
	console.log('listening on *:' + port);
});
