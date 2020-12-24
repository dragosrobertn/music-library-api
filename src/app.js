const express = require('express');
const app = express();
const Artist = require('./models/artist')
app.use(express.json());

app.get('/', (req, res) => {
    res.json({ result: 'Hello World' });
})

app.post('/artists', (req, res) => {
res.status(201).json({ result: req.body.id})
})

module.exports = app;