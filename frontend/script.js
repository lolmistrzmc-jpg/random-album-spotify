const button = document.getElementById('getAlbum');
const albumDiv = document.getElementById('album');

button.addEventListener('click', async () => {
  try {
    const res = await fetch('https://random-album-spotify.onrender.com');
    const album = await res.json();
    albumDiv.innerHTML = `
      <h2>${album.name}</h2>
      <p>${album.artists.map(a => a.name).join(', ')}</p>
      <img src="${album.images[0].url}" width="200"/>
      <p><a href="${album.external_urls.spotify}" target="_blank">Otwórz w Spotify</a></p>
    `;
  } catch (err) {
    albumDiv.textContent = 'Błąd pobierania albumu';
  }
});
