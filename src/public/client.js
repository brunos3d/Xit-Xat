$(() => {
	var socket = io();

	$('form').submit(() => {
		var msg = $('#text-box').val();

		if (msg && msg != undefined && msg != null) {
			socket.emit('chat message', msg);

			$('#text-box').val('');
		}
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
			"class": 'swing-in-bottom-fwd' + className ? ' ' + className : '',
		}).text(msg));
		var scrollbar = $('#scrollbar');
		scrollbar.scrollTop(1e4);
	}
});