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

function updateVolumeIcon() {
	const volume = document.querySelector('#progress-volume').value;
	const icon_volume = document.querySelector('#icon-volume');
	if (volume == 0) {
		if (icon_volume.classList.contains('bi-volume-up-fill')) {
			icon_volume.classList.toggle('bi-volume-up-fill');
			icon_volume.classList.toggle('bi-volume-mute-fill');
		} else if (icon_volume.classList.contains('bi-volume-down-fill')) {
			icon_volume.classList.toggle('bi-volume-down-fill');
			icon_volume.classList.toggle('bi-volume-mute-fill');
		}
	} else if (volume > 0 && volume <= 50) {
		if (icon_volume.classList.contains('bi-volume-mute-fill')) {
			icon_volume.classList.toggle('bi-volume-mute-fill');
			icon_volume.classList.toggle('bi-volume-down-fill');
		} else if (icon_volume.classList.contains('bi-volume-up-fill')) {
			icon_volume.classList.toggle('bi-volume-up-fill');
			icon_volume.classList.toggle('bi-volume-down-fill');
		}
	} else if (volume > 50 && volume <= 100) {
		if (icon_volume.classList.contains('bi-volume-mute-fill')) {
			icon_volume.classList.toggle('bi-volume-mute-fill');
			icon_volume.classList.toggle('bi-volume-up-fill');
		} else if (icon_volume.classList.contains('bi-volume-down-fill')) {
			icon_volume.classList.toggle('bi-volume-down-fill');
			icon_volume.classList.toggle('bi-volume-up-fill');
		}
	}

}

function updateVolumeIconButton() {
	const mute = player.isMuted();
	const icon_volume = document.querySelector('#icon-volume');
	if (mute) {
		if (icon_volume.classList.contains('bi-volume-up-fill')) {
			icon_volume.classList.toggle('bi-volume-up-fill');
		} else if (icon_volume.classList.contains('bi-volume-down-fill')) {
			icon_volume.classList.toggle('bi-volume-down-fill');
		}
		icon_volume.classList.toggle('bi-volume-mute-fill');
	} else {
		updateVolumeIcon();
	}
}

function updateIconPlay(state) {
	const icon_play = document.querySelector('#icon-play');
	if (playerState == 0) {
		if (icon_play.classList.contains('bi-play-fill')) {
			icon_play.classList.toggle('bi-play-fill');
			icon_play.classList.toggle('bi-pause-fill');
		} else if (icon_play.classList.contains('bi-pause-fill')) {
			icon_play.classList.toggle('bi-pause-fill');
			icon_play.classList.toggle('bi-play-fill');
		}
	} else if (playerState == 1 && state == 0) {
		if (icon_play.classList.contains('bi-pause-fill')) {
			icon_play.classList.toggle('bi-pause-fill');
			icon_play.classList.toggle('bi-play-fill');
		} else if (icon_play.classList.contains('bi-play-fill')) {
			icon_play.classList.toggle('bi-play-fill');
			icon_play.classList.toggle('bi-pause-fill');
		}
	}else if (playerState == 1 && state == 1) {
		if (icon_play.classList.contains('bi-play-fill')) {
			icon_play.classList.remove('bi-play-fill');
			icon_play.classList.add('bi-pause-fill');
		}
	}
}

function onPlayerReady(event) {
	console.log("Cargo el video");
	document.querySelector("#progress-volume").value = player.getVolume();
	spinner();
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
	player_image.src = track.md5_image;
	player_title.innerHTML = track.title;
	player_artist.innerHTML = track.artist_name;
	player_duration.innerHTML = getDurationString(track.duration);
	player_current.innerHTML = '00:00';
	progress_volume.value = player.getVolume();
	progress_track.value = player.getCurrentTime();

	youTubePlayerChangeVideoId(track.youtube_id);
	if (playerState == 0) {
		//* Espera 500ms para que cargue el video
		setTimeout(() => {
			player.playVideo();
			playerState = 1;
			addHistory(track);
			updateHistory();
			updateIconPlay(01);
			main_player.classList.toggle('move__left');
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
			// <div class="history__card">
			// 		<div class="history__card--img">
			// 			<img src="https://cdns-images.dzcdn.net/images/cover/d41d8cd98f00b204e9800998ecf8427e/264x264-000000-80-0-0.jpg"
			// 				alt="Album Cover" class="" loading="lazy" />
			// 		</div>
			// 		<div class="history__card--info">
			// 			<h5 class="history__card--title">No hay canciones</h5>
			// 			<h6 class="history__card--artist">No hay Artistas</h6>
			// 		</div>
			// 		<button class="history__card--btn" onclick="play()">
			// 			<i class="bi bi-play-fill"></i>
			// 		</button>
			// 	</div>
			const card = document.createElement('div');
			card.classList.add('history__card');
			const img = document.createElement('div');
			img.classList.add('history__card--img');
			const img_src = document.createElement('img');
			img_src.src = track.md5_image;
			img.appendChild(img_src);
			const info = document.createElement('div');
			info.classList.add('history__card--info');
			const title = document.createElement('h5');
			title.classList.add('history__card--title');
			title.innerHTML = track.title;
			const artist = document.createElement('h6');
			artist.classList.add('history__card--artist');
			artist.innerHTML = track.artist_name;
			info.appendChild(title);
			info.appendChild(artist);
			const btn = document.createElement('button');
			btn.classList.add('history__card--btn');
			btn.addEventListener('click', () => {
				play(track.deezer_id);
			}
			);
			const icon = document.createElement('i');
			icon.classList.add('bi');
			icon.classList.add('bi-play-fill');
			btn.appendChild(icon);
			card.appendChild(img);
			card.appendChild(info);
			card.appendChild(btn);
			content.appendChild(card);
		})
	}
}

function spinner() {
	const main_search = document.querySelector('#main-search');
	const spinner = document.querySelector('#spinner');

	setTimeout(() => {
		spinner.classList.add('d_none');
		main_search.classList.remove('d_none');

	}, 1500);
}


document.addEventListener('DOMContentLoaded', () => {
	updateHistory();
	updateIconPlay(00);
	console.log(playerState);
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
		updateIconPlay(0);
	});

	const progress_track = document.querySelector('#progress-track');
	progress_track.addEventListener('change', (e) => {
		player.currentTimeSliding = false;
		player.seekTo(e.target.value * player.getDuration() / 100, true);
	});

	const progress_volume = document.querySelector('#progress-volume');
	progress_volume.addEventListener('change', (e) => {
		player.setVolume(e.target.value);
		updateVolumeIcon();
	});

	const player_volume = document.querySelector('#player-volume');
	player_volume.addEventListener('click', () => {
		if (player.isMuted()) {
			player.unMute();
		} else {
			player.mute();
		}
		updateVolumeIconButton();
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



