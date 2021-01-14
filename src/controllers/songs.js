const { Album, Artist, Song } = require("../models");

exports.create = (req, res) => {
  const { artistId } = req.body;
  const { albumId } = req.params;
  Artist.findByPk(artistId).then((artist) => {
    if (!artist) {
      res.status(404).json({ error: "The artist could not be found." });
    } else {
      Album.findByPk(albumId).then((album) => {
        if (!album) {
          res.status(404).json({ error: "The album could not be found." });
        } else {
          Song.create({

            name: req.body.name,
          }).then((song) => {
            song.setArtist(artist).then((song) => {
              song.setAlbum(album).then((song) => {
                res.status(201).json(song);
              });
            });
          });
        }
      });
    }
  });
};

exports.list = (req, res) => {

    Album.findAll({
      include: [
        {
          model: Artist,
          as: "artist",
        },
      ],
    }).then((albums) => {
      res.status(200).json(albums);
    });
  };
