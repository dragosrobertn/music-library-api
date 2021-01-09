const { Album } = require("../models");
const { Artist } = require("../models");
const album = require("../models/album");

exports.create = (req, res) => {


    
  Album.create(req.body).then((artist) => res.status(201).json(artist));

//   Album.findByPk(id).then() => res.status(201).json(artist);
}



