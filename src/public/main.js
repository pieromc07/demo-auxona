let player;
let playerState = 0;
let history = [];
let historyIndex = 0;

//* Create an <iframe> (and YouTube player)
function onYouTubeIframeAPIReady() {
	player = new YT.Player("player", {
		height: 200,
		width: 200,
		videoId: "8KrO5akeQgI",
		playerVars: {
			playsinline: 1,
			autoplay: 0,
			controls: 1,
		},
		events: {
			onReady: onPlayerReady,
			onStateChange: onPlayerStateChange,
		},
	});
}

function onPlayerReady(event) {
	console.log("Cargo el video");
	setInterval(updateTime, 1000);
}

var done = false;
function onPlayerStateChange(event) {
	if (event.data == YT.PlayerState.PLAYING && !done) {
		done = true;
	}
}

function youTubePlayerChangeVideoId(videoId) {
	player.cueVideoById({ suggestedQuality: "medium", videoId: videoId });
	player.pauseVideo();
	playerState = 0;
}

function updateTime() {
	var currentTime = player.getCurrentTime();
	var duration = player.getDuration();
	currentTime = Math.floor(currentTime);
	const player_current = document.querySelector('#player-current');
	player_current.innerHTML = getDurationString(currentTime);
	const progress_track = document.querySelector('#progress-track');
	progress_track.value = (currentTime / duration) * 100;
}

async function play(id) {

	let track = await fetch(`app/track/${id}`)
		.then(response => response.json())
		.then(data => data);
	let saved = false;
	if (track.youtube_id == null) {
		const youtube = await fetch(`app/youtube/${track.searchable}`)
			.then(response => response.json())
			.then(data => data);
		const video = await fetch(`app/video/${youtube.id}`)
			.then(response => response.json())
			.then(data => data);
		track.youtube_id = video.id;
		track.duration = getDuration(video.duration);
		saved = true;
		// track.youtube_id = 'ca48oMV59LU';
	}
	const player_image = document.querySelector('#player-image');
	const player_title = document.querySelector('#player-title');
	const player_artist = document.querySelector('#player-artist');
	const player_duration = document.querySelector('#player-duration');
	const player_current = document.querySelector('#player-current');
	const progress_volume = document.querySelector('#progress-volume');
	const progress_track = document.querySelector('#progress-track');
	const main_player = document.querySelector('#main-player');
	main_player.classList.toggle('move__left');
	player_image.src = track.md5_image;
	player_title.innerHTML = track.title;
	player_artist.innerHTML = track.artist_name;
	player_duration.innerHTML = getDurationString(track.duration);
	player_current.innerHTML = '00:00';
	progress_volume.value = player.getVolume();
	progress_track.value = player.getCurrentTime();
	const icon_volumen = document.querySelector('#icon-volumen');
	
	youTubePlayerChangeVideoId(track.youtube_id);
	if (playerState == 0) {
		//* Espera 500ms para que cargue el video
		setTimeout(() => {
			player.playVideo();
			playerState = 1;
			addHistory(track);
			updateHistory();
			if (saved) {
				saveTrack(track);
			}
		}, 1000);
	}
}

//* GUARDAR EN LA BASE DE DATOS
async function saveTrack(track) {
	localStorage.setItem('track', JSON.stringify(track));
	const data = await fetch(`app/save`,
		{
			method: 'POST',
			headers: {
				'Content-Type': 'application/json'
			},
			body: JSON.stringify(track)

		}).then(response => response.json())
		.then(data => data);

	console.log(data);


}

//* GET de la API de Deezer
async function searchTrack(query) {
	const data = await fetch(`app/search/${query}`)
		.then( // return response.json
			response => response.json()
		)
		.then(data => data
		);
	return data;
}

function getDuration(duration) {

	let minutes = duration.substring(2, duration.indexOf('M'));
	let seconds = duration.substring(duration.indexOf('M') + 1, duration.indexOf('S'));
	if (seconds.length == 1) {
		seconds = '0' + seconds;
	}
	return parseInt(minutes) * 60 + parseInt(seconds);
}

function getDurationString(duration) {
	let minutes = Math.floor(duration / 60);
	let seconds = duration % 60;
	if (seconds < 10) {
		seconds = '0' + seconds;
	}
	return minutes + ':' + seconds;
}

function addHistory(track) {
	//* Agregar a la lista de reproduccion si no existe
	if (history.length == 0) {
		history.push(track);
	} else {
		let exists = false;
		history.map((item, index) => {
			if (item.deezer_id == track.deezer_id) {
				exists = true;
				history.splice(index, 1);
				history.push(track);
			}
		}
		);
		if (!exists) {
			history.push(track);
		}
	}
}
function updateHistory() {
	const content = document.querySelector('#history');
	if (history.length > 0) {
		content.innerHTML = '';
		history.map(track => {
			const history_content = document.createElement('div');
			history_content.classList.add('history_content');
			const history_content_item = document.createElement('div');
			history_content_item.classList.add('history_content_item');
			const history_content_item_image = document.createElement('div');
			history_content_item_image.classList.add('history_content_item_image');
			const history_content_item_image_img = document.createElement('img');
			history_content_item_image_img.src = track.md5_image;
			const history_content_item_image_play = document.createElement('button');
			history_content_item_image_play.classList.add('history_content_item_image_play');
			history_content_item_image_play.addEventListener('click', () => {
				play(track.deezer_id);
			}
			);
			const history_content_item_image_play_icon = document.createElement('i');
			history_content_item_image_play_icon.classList.add('fas');
			history_content_item_image_play_icon.classList.add('fa-play');
			const history_content_item_description = document.createElement('div');
			history_content_item_description.classList.add('history_content_item_description');
			const history_content_item_description_title = document.createElement('p');
			history_content_item_description_title.classList.add('history_content_item_description_title');
			history_content_item_description_title.innerHTML = track.title;
			const history_content_item_description_artist = document.createElement('p');
			history_content_item_description_artist.classList.add('history_content_item_description_artist');
			history_content_item_description_artist.innerHTML = track.artist_name;

			history_content_item_image_play.appendChild(history_content_item_image_play_icon);
			history_content_item_image.appendChild(history_content_item_image_img);
			history_content_item_image.appendChild(history_content_item_image_play);
			history_content_item_description.appendChild(history_content_item_description_title);
			history_content_item_description.appendChild(history_content_item_description_artist);
			history_content_item.appendChild(history_content_item_image);
			history_content_item.appendChild(history_content_item_description);
			history_content.appendChild(history_content_item);
			content.appendChild(history_content);
		});
	} else {
		content.innerHTML = '<div class="history-empty">No hay historial</div>';
	}
}

document.addEventListener('DOMContentLoaded', () => {

	updateHistory();

	const search = document.querySelector('#search');
	search.addEventListener('click', async () => {
		const query = document.querySelector('#data-search').value;
		if (query) {
			const tracks = await searchTrack(query);
			if (tracks) {
				const container = document.querySelector('#tracks');
				container.innerHTML = '';

				tracks.map(result => {
					const card = document.createElement('div');
					card.classList.add('card__track');
					const img = document.createElement('img');
					img.src = result.md5_image;
					img.classList.add('card__track--img');
					img.alt = result.title;
					const description = document.createElement('div');
					description.classList.add('card__track--description');
					const title = document.createElement('p');
					title.classList.add('description__title');
					title.textContent = result.title_short;
					description.appendChild(title);
					const artist = document.createElement('p');
					artist.classList.add('description__artist');
					artist.textContent = result.artist[0].name;
					description.appendChild(artist);
					const button = document.createElement('button');
					button.classList.add('card__track--btn');
					button.addEventListener('click', () => {
						play(result.id);
					});
					const icon = document.createElement('i');
					icon.classList.add('bi');
					icon.classList.add('bi-play-fill');
					button.appendChild(icon);
					card.appendChild(img);
					card.appendChild(description);
					card.appendChild(button);
					container.appendChild(card);
				});
			} else {
				const container = document.querySelector('#tracks');
				container.innerHTML = '';
				const message = document.createElement('p');
				message.textContent = 'No se encontraron resultados';
				container.appendChild(message);
			}
		}

	});

	const player_play = document.querySelector('#player-play');
	player_play.addEventListener('click', () => {
		console.log("playerState: " + playerState);
		if (playerState == 0) {
			player.playVideo();
			playerState = 1;
		} else {
			player.pauseVideo();
			playerState = 0;
		}
		if (playerState == 0) {
			document.querySelector('#icon-play').classList.remove('bi-play-fill');
			document.querySelector('#icon-play').classList.add('bi-pause-fill');
		} else {
			document.querySelector('#icon-play').classList.remove('bi-pause-fill');
			document.querySelector('#icon-play').classList.add('bi-play-fill');
		}

	});

	const progress_track = document.querySelector('#progress-track');
	progress_track.addEventListener('change', (e) => {
		player.currentTimeSliding = false;
		player.seekTo(e.target.value * player.getDuration() / 100, true);
	});

	const progress_volume = document.querySelector('#progress-volume');
	const icon_volumen = document.querySelector('#icon-volume');
	progress_volume.addEventListener('change', (e) => {
		player.setVolume(e.target.value);
		if (e.target.value == 0) {
			icon_volumen.classList.remove('bi-volume-up-fill');
			icon_volumen.classList.add('bi-volume-mute-fill');
		} else if (e.target.value <= 50) {
			if (icon_volumen.classList.contains('bi-volume-mute-fill')) {
				icon_volumen.classList.remove('bi-volume-mute-fill');
				icon_volumen.classList.add('bi-volume-down-fill');
			} else {
				icon_volumen.classList.remove('bi-volume-up-fill');
				icon_volumen.classList.add('bi-volume-down-fill');
			}
		} else {
			icon_volumen.classList.remove('bi-volume-down-fill');
			icon_volumen.classList.add('bi-volume-up-fill');
		}
	});

	const player_volume = document.querySelector('#player-volume');
	player_volume.addEventListener('click', () => {
		if (player.isMuted()) {
			player.unMute();
			if (icon_volumen.classList.contains('bi-volume-mute-fill')) {
				icon_volumen.classList.remove('bi-volume-mute-fill');
				if (progress_volume.value <= 50) {
					icon_volumen.classList.add('bi-volume-down-fill');
				} else {
					icon_volumen.classList.add('bi-volume-up-fill');
				}
			}
		} else {
			player.mute();
			if (icon_volumen.classList.contains('bi-volume-down-fill')) {
				icon_volumen.classList.remove('bi-volume-down-fill');
			} else {
				icon_volumen.classList.remove('bi-volume-up-fill');
			}
			icon_volumen.classList.add('bi-volume-mute-fill');
		}
	});

	const player_next = document.querySelector('#player-next');
	player_next.addEventListener('click', () => {
		if (historyIndex < history.length - 1) {
			historyIndex++;
			play(history[historyIndex].deezer_id);
		} else {
			alert('No hay mas canciones');
		}
	});

	const player_back = document.querySelector('#player-back');
	player_back.addEventListener('click', () => {
		if (historyIndex > 0) {
			historyIndex--;
			play(history[historyIndex].deezer_id);
		} else {
			alert('No hay mas canciones');
		}
	});
	const main_player = document.querySelector('#main-player');
	const main_history = document.querySelector('#main-history');
	const show_player = document.querySelector('#show-player');
	const show_history = document.querySelector('#show-history');
	const back_search = document.querySelector('#back-search');
	const back_search_h = document.querySelector('#back-search-h');
	show_player.addEventListener('click', () => {
		main_player.classList.toggle('move__left');
	});
	show_history.addEventListener('click', () => {
		main_history.classList.toggle('d_none');
		setTimeout(() => {
			main_history.classList.toggle('move__right');
		}, 500);
	});
	back_search.addEventListener('click', () => {
		main_player.classList.toggle('move__left');
	});
	back_search_h.addEventListener('click', () => {
		main_history.classList.toggle('move__right');
		setTimeout(() => {
			main_history.classList.toggle('d_none');
		}, 500);
	});
});



