const artistControllers = require('./controllers/artists');
const albumControllers = require('./controllers/albums')
const express = require('express');
const app = express();
app.use(express.json());



app.post('/artists',  artistControllers.create);

app.get('/artists', artistControllers.list);

app.get('/artists/:artistId', artistControllers.getArtistById);

app.patch('/artists/:id', artistControllers.update);

app.delete('/artists/:id', artistControllers.destroy);

app.post('/artists/:artistId/albums', albumControllers.create);

app.post('/artists/:artistId/albums', albumControllers.list);

app.get('/albums', albumControllers.list);

app.get('/albums/:albumId', albumControllers.getAlbumById);


module.exports = app;