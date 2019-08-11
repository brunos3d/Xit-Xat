const express = require('express');
const app = express();
const http = require('http').Server(app);
const io = require('socket.io')(http);
const port = process.env.PORT || 5000;

app.use(express.static(__dirname + '/public'));

var connectedUsers = {};
var connectedUsersCount = 0;
const names = ['Tokio', 'Rio', 'Nairobi', 'Berlim', 'Palermo', 'Denver'];

io.on('connection', (socket) => {
	const username = names[connectedUsersCount++ % names.length];
	const user = { username, id: socket.id };
	connectedUsers[socket.id] = user;

	socket.emit('set user', user);

	io.emit('new user', user);

	socket.on('chat message', msg => {
		const user = connectedUsers[socket.id];
		io.emit('chat message', { user, msg });
	});
});

http.listen(port, () => {
	console.log('listening on *:' + port);
});
