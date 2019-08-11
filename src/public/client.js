$(() => {
	var socket = io();
	var focused = true;
	var unreadMessages = 0;
	var audio = new Audio('bubble.mp3');

	$('form').submit(() => {
		const textbox = $('#text-box');
		const msg = textbox.val();

		if (msg && msg != undefined && msg != null) {
			socket.emit('chat message', msg);

			textbox.val('');
		}

		textbox.focus();
		return false;
	});

	socket.on('new user', (user) => {
		appendMessage(`${user.username}, entrou na sala.`, 'font-bold-n-italic bounce-in-left');
	});

	socket.on('chat message', (msg) => {
		appendMessage(msg);
	});

	function appendMessage(msg, className) {
		$('#message-list').append($('<li>', {
			"class": 'swing-in-bottom-fwd' + (className ? ' ' + className : ''),
		}).text(msg));
		var scrollbar = $('#scrollbar');
		scrollbar.scrollTop(1e4);

		if (!focused) {
			if (audio.paused) {
				audio.play();
			}
			if (unreadMessages++ == 0) {
				document.title = 'Xit-Xat - ' + msg;
			}
			else {
				document.title = `Xit-Xat - (${unreadMessages}) Novas mensagens...`
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