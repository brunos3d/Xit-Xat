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

	socket.on('chat message', (msg) => {
		$('#message-list').append($('<li>', {
			"class": 'swing-in-bottom-fwd'
		}).text(msg));
		var scrollbar = $("#scrollbar");
		scrollbar.scrollTop(1e4);
	});
});