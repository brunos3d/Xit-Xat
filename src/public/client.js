$(() => {
	const socket = io();
	const audio = new Audio('bubble.mp3');

	let focused = true;
	let currentUser = null;
	let unreadMessages = 0;
	let connectedUsersCount = 0;

	$('form').submit(() => {
		const textbox = $('#text-box');
		const msg = textbox.val();

		if (msg) {
			socket.emit('chat message', msg);

			textbox.val('');
		}

		textbox.focus();
		return false;
	});

	socket.on('set user', (user) => {
		currentUser = user;
	});

	socket.on('update online users', (count) => {
		connectedUsersCount = count;
		$('#top-title').text(`Bate-Papo (${count})`);
	});

	socket.on('user connected', (user) => {
		appendMessage(user, `${user.username}, entrou na sala.`, 'font-bold-n-italic bounce-in-left');
	});

	socket.on('user disconnected', (user) => {
		appendMessage(user, `${user.username}, saiu da sala.`, 'font-bold-n-italic bounce-in-left');
	});

	socket.on('chat message', (data) => {
		const { user, msg } = data;
		appendMessage(user, msg);
	});

	function appendMessage(user, msg, className) {
		const li = $('<li>', {
			"class": 'message-item swing-in-bottom-fwd',
		});

		const avatarInfo = $('<div>', {
			"class": 'avatar-info',
		});

		const avatarImage = $('<img>', {
			"class": 'avatar-image',
			src: `./static/${user.username.toLowerCase().replace(/(\W|\d)*/g, '')}.png`,
		});

		const avatarName = $('<p>', {
			"class": 'avatar-name',
			text: user.username,
		});

		const message = $('<p>', {
			"class": 'message-item-text' + (className ? ' ' + className : ''),
			text: msg,
		});

		avatarInfo.append(avatarImage);
		avatarInfo.append(avatarName);
		li.append(avatarInfo);
		li.append(message);

		$('#message-list').append(li);

		let scrollbar = $('#scrollbar');
		scrollbar.scrollTop(1e4);

		if (!focused) {
			if (audio.paused) {
				audio.play();
			}
			if (unreadMessages++ == 0) {
				document.title = 'Xit-Xat - ' + msg;
			}
			else {
				document.title = `Xit - Xat - (${unreadMessages}) Novas mensagens...`
			}
		}
	}

	$(window).focus(function () {
		focused = true;
		unreadMessages = 0;
		document.title = 'Xit-Xat';
	});

	$(window).blur(function () {
		focused = false;
	});
});