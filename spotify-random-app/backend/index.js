import express from 'express';
import fetch from 'node-fetch';
import cors from 'cors';
import path from 'path';
import { fileURLToPath } from 'url';


const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);


const app = express();
const PORT = process.env.PORT || 3000;


app.use(cors());


// Serwowanie frontend
app.use(express.static(path.join(__dirname, '../frontend')));


const SPOTIFY_CLIENT_ID = process.env.SPOTIFY_CLIENT_ID;
const SPOTIFY_CLIENT_SECRET = process.env.SPOTIFY_CLIENT_SECRET;


async function getSpotifyToken() {
const auth = Buffer.from(`${SPOTIFY_CLIENT_ID}:${SPOTIFY_CLIENT_SECRET}`).toString('base64');
const res = await fetch('https://accounts.spotify.com/api/token', {
method: 'POST',
headers: {
Authorization: `Basic ${auth}`,
'Content-Type': 'application/x-www-form-urlencoded'
},
body: 'grant_type=client_credentials'
});
const data = await res.json();
return data.access_token;
}


app.get('/random-album', async (req, res) => {
try {
const token = await getSpotifyToken();
const response = await fetch('https://api.spotify.com/v1/browse/new-releases?limit=50', {
headers: { Authorization: `Bearer ${token}` }
});
const data = await response.json();
const albums = data.albums.items;
const random = albums[Math.floor(Math.random() * albums.length)];
res.json(random);
} catch (err) {
res.status(500).json({ error: 'Błąd pobierania albumu' });
}
});


// Wszystkie inne requesty kierujemy na frontend (SPA)
app.get('*', (req, res) => {
res.sendFile(path.join(__dirname, '../frontend/index.html'));
});


app.listen(PORT, () => console.log(`Backend running on port ${PORT}`));