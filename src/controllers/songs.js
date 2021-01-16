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
  Song.findAll({
    include: [
      {
        model: Artist,
        as: "artist",
      },
      {
        model: Album,
        as: "album",
      },
    ],
  }).then((songs) => {
    res.status(201).json(songs);
  });
};

exports.getSongById = (req, res) => {
  const { songId } = req.params;
  Song.findByPk(songId).then((song) => {
    if (!song) {
      res.status(400).json({ error: "The song could not be found." });
    } else {
      res.status(200).json(song);
    }
  });
};

exports.update = (req, res) => {
  const { id } = req.params;

  Song.update(req.body, { where: { id } }).then(([updatedSong]) => {
    if (!updatedSong) {
      res.status(400).json({ error: "The song cannot be found." });
    } else {
      Song.findByPk(id).then((song) => {
        res.status(200).json(song);
      });
    }
  });
};

exports.destroy = (req, res) => {
  const { id } = req.params;

  Song.destroy( { where: { id } }).then(([numberofrows]) => {
    console.log(song)
    if (!numberofrows) {
      res.status(404).json({ error: "The song cannot be found." });
    } else {
      Song.findByPk(id).then((song) => {
        res.status(204).json(song);
      });
    }
  });
};
