$(() => {
	var socket = io();

	$('form').submit(() => {
		socket.emit('chat message', $('#text-box').val());

		$('#text-box').val('');

		return false;
	});

	socket.on('chat message', (msg) => {
		if (msg) {
			$('#message-list').append($('<li>').text(msg));
			var scrollbar = $("#scrollbar");
			scrollbar.scrollTop(1e4);
		}
	});
});