const artistControllers = require('./controllers/artists');
const express = require('express');
const app = express();
app.use(express.json());



app.post('/artists',  artistControllers.create);

app.get('/artists', artistControllers.list);

app.get('/artists/:artistId', artistControllers.getArtistById);

app.patch('/artists/:id', artistControllers.update);

app.delete('/artists/:id', artistControllers.destroy);

module.exports = app;