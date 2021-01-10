const { Album } = require("../models");
const { Artist } = require("../models");
const album = require("../models/album");

exports.create = (req, res) => {
    Album.create({name: req.body.name, year:req.body.year, artistId: req.params.artistId}).then(updatedAlbum =>  res.status(201).json(updatedAlbum));
};

exports.getAlbumById = (req, res) => {
    const artistId = req.params.artistId;
    console.log(req.params.artistId);


   Album.findByPk(artistId).then((artist) => {
        if (!artist) {
          res.status(404).json({ error: "The artist could not be found." });
        } else {
          res.status(200).json(artist);
        }
      });
    };
    



