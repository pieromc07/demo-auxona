let player;
let playerState = 0;
let dateInit;

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
			dateInit = new Date();
			activarEvento();
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

document.addEventListener('DOMContentLoaded', () => {

	const search = document.querySelector('#search');

	search.addEventListener('click', async () => {
		const query = document.querySelector('#data-search').value;
		if (query) {
			const tracks = await searchTrack(query);
			if (tracks) {
				const container = document.querySelector('#tracks');
				container.innerHTML = '';

				tracks.map(result => {
					const column = document.createElement('div');
					column.classList.add('col-6');
					column.classList.add('col-md-4');
					column.classList.add('col-lg-3');
					const card = document.createElement('div');
					card.classList.add('card-track');
					const img = document.createElement('img');
					img.src = result.md5_image;
					img.classList.add('track_image');
					img.alt = result.title;
					const description = document.createElement('div');
					description.classList.add('track_description');
					const title = document.createElement('p');
					title.textContent = result.title_short;
					description.appendChild(title);
					const button = document.createElement('button');
					button.classList.add('track-play');
					button.addEventListener('click', () => {
						play(result.id);
					});
					const icon = document.createElement('i');
					icon.classList.add('fas');
					icon.classList.add('fa-play');
					button.appendChild(icon);
					card.appendChild(img);
					card.appendChild(description);
					card.appendChild(button);
					column.appendChild(card);
					container.appendChild(column);

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
		if (playerState == 0) {
			player.playVideo();
			playerState = 1;
		} else {
			player.pauseVideo();
			playerState = 0;
		}
	});

	const progress_track = document.querySelector('#progress-track');
	progress_track.addEventListener('change', (e) => {
		console.log('change');
		player.currentTimeSliding = false;
		player.seekTo(e.target.value * player.getDuration() / 100, true);
		// volver activar el evento change
		activarEvento()
	});

	progress_track.addEventListener('oninput', (e) => {
		player.currentTimeSliding = true;
	});

	const progress_volume = document.querySelector('#progress-volume');
	progress_volume.addEventListener('change', (e) => {
		player.setVolume(e.target.value);
	});

	const player_volume = document.querySelector('#player-volume');
	player_volume.addEventListener('click', () => {
		if (player.isMuted()) {
			player.unMute();
		} else {
			player.mute();
		}
	});

});
function activarEvento() {
	const progress_track = document.querySelector('#progress-track');
	let mode = 0;
	// si existe el evento change lo elimina
	if (progress_track.onchange) {
		progress_track.onchange = null;
		mode = 1;
		console.log('eliminado');
	}
	// activa el evento change
	progress_track.onchange = changeTime(mode);
	console.log('activado');
}	

function changeTime(mode) {
	const player_current = document.querySelector('#player-current');
	const progress_track = document.querySelector('#progress-track');

	if (mode == 0) {
		var currentDate = new Date();
		var seconds = (currentDate - dateInit) / 1000;
		progress_track.value = seconds;
		console.log('change ' + seconds);
	}else{
		progress_track.value = player.getCurrentTime() * 100 / player.getDuration();
		console.log('change 1');
	}
	// activarEvento();
}
