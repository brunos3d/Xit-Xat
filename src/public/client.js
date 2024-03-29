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
		appendMessage(user, `${user.username}, entrou na sala.`, 'bounce-in-left', 'font-bold-n-italic');
	});

	socket.on('user disconnected', (user) => {
		appendMessage(user, `${user.username}, saiu da sala.`, 'bounce-in-left', 'font-bold-n-italic');
	});

	socket.on('chat message', (data) => {
		const { user, msg } = data;
		appendMessage(user, msg);
	});

	function appendMessage(user, msg, anim, style) {
		const li = $('<li>', {
			"class": 'message-item ' + (anim ? anim : 'swing-in-bottom-fwd'),
		});

		const avatarInfo = $('<div>', {
			"class": 'avatar-info',
		});

		const messageArea = $('<div>', {
			"class": 'message-item-area',
		});

		const avatarImage = $('<img>', {
			"class": 'avatar-image',
			src: `./static/${user.username.toLowerCase().replace(/(\W|\d)*/g, '')}.png`,
		});

		const avatarName = $('<p>', {
			"class": 'avatar-name',
			text: user.username,
		});

		avatarInfo.append(avatarImage);
		avatarInfo.append(avatarName);

		li.append(avatarInfo);

		const urlsPattern = /\bhttps?:\/\/\S+/gi;
		const urls = msg.match(urlsPattern);
		// console.log(urls);

		if (urls) {
			const message = $('<p>', {
				"class": 'message-item-text' + (style ? ' ' + style : ''),
			});
			// replace urls in msg text with a href tags 
			const hyperlinkedMessage = msg.replace(urlsPattern, (matched) => {
				const href = $('<a>', {
					"class": 'message-item-link' + (style ? ' ' + style : ''),
					href: matched,
					text: matched,
					target: '_blank',
				})
				return href.prop('outerHTML');
			});

			// console.log(hyperlinkedMessage);
			message.append(hyperlinkedMessage);

			messageArea.append(message);

			const ytb = urls.find(url => url.includes('youtu'));
			// console.log(ytb);

			if (ytb) {
				function getId(url) {
					var ytbUrlPattern = /^.*(youtu.be\/|v\/|u\/\w\/|embed\/|watch\?v=|\&v=)([^#\&\?]*).*/;
					var matches = url.match(ytbUrlPattern);

					if (matches && matches[2].length == 11) {
						return matches[2];
					}
					else {
						return undefined;
					}
				}
				const videoId = getId(ytb);
				// console.log(videoId);

				if (videoId) {
					const video = $('<iframe>', {
						"class": 'youtube-view',
						title: 'YouTube video player',
						type: 'text/html',
						width: '560px',
						height: '315px',
						src: `https://www.youtube.com/embed/${videoId}`,
						frameborder: '0',
					});

					// Add youtube video to message area 
					messageArea.append(video);
				}
			}
		}
		else {
			const message = $('<p>', {
				"class": 'message-item-text' + (style ? ' ' + style : ''),
				text: msg,
			});
			messageArea.append(message);
		}

		li.append(messageArea);

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