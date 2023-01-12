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
	// Controls
	const player_back = document.querySelector('#player-back');
	const player_play = document.querySelector('#player-play');
	const player_next = document.querySelector('#player-next');

	iFrameOn('ca48oMV59LU');
}

function iFrameOn(videoId) {
	const player = document.querySelector('#player');
	player.innerHTML = `<iframe width="100%" height="100%" src="https://www.youtube.com/embed/${videoId}?autoplay=1" frameborder="0" allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture" allowfullscreen></iframe>`;
}

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

});
