let player;
let playerState = 0;

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

function onPlayerReady() {
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

	const track = await fetch(`/track/${id}`)
		.then(response => response.json())
		.then(data => data);
	// const youtube = await fetch(`/youtube/${track.title_short}`)
	// 	.then(response => response.json())
	// 	.then(data => data);
	// const video = await fetch(`/video/${youtube.id}`)
	// 	.then(response => response.json())
	// 	.then(data => data);
	// console.log(video);
	const player_image = document.querySelector('#player-image');
	const player_title = document.querySelector('#player-title');
	const player_artist = document.querySelector('#player-artist');
	player_image.src = track.album.cover_big;
	player_title.innerHTML = track.title;
	player_artist.innerHTML = track.artist.name;

	youTubePlayerChangeVideoId('ca48oMV59LU');
	if (playerState == 0) {
		//* Espera 500ms para que cargue el video
		setTimeout(() => {
			player.playVideo();
			playerState = 1;
		}, 500);
	}
}

//* GET de la API de Deezer
async function searchTrack(query) {

	const data = await fetch(`/search/${query}`)
		.then( // return response.json
			response => response.json()
		)
		.then(data => data
		);
	return data;
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
		player.currentTimeSliding = false;
		player.seekTo(e.target.value * player.getDuration() / 100, true);
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
