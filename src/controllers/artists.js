 models = require('../models');


exports.create = (req, res) => {

  models.Artist.create(req.body).then(artist => res.status(201).json(artist));

};

exports.list = ( req, res ) => {
  
  models.Artist.findAll().then(artists => res.status(200).json(artists));

};