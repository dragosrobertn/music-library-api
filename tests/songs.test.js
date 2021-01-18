const { expect } = require("chai");
const request = require("supertest");
const app = require("../src/app");
const { Artist, Album, Song } = require("../src/models");
// const song = require("../src/models/song");

describe('/songs', () => {
  let artist;
  let album;
before(async () => {
  try {
    await Artist.sequelize.sync();
    await Album.sequelize.sync();
    await Song.sequelize.sync();
  } catch (err) {
    console.log(err);
  }
});
beforeEach(async () => {
  try {
    await Artist.destroy({ where: {} });
    await Album.destroy({ where: {} });
    await Song.destroy({ where: {} });

    artist = await Artist.create({
      name: "Sinach",
      genre: "Worship",
    });
    album = await Album.create({
      name: "I'm Blessed",
      year: 2011,
      artistId: artist.id,
    });
  } catch (err) {
    console.log(err);
  }
});

describe("POST /albums/:albumId/songs", () => {
  it("creates a new song under an album", (done) => {
    request(app)
      .post(`/albums/${album.id}/songs`)
      .send({
        albumId: album.id,
        artistId: artist.id,
        name: "Born to Win",
      })
      .then((res) => {
        expect(res.status).to.equal(201);
        const songId = res.body.id;
        expect(res.body.id).to.equal(songId);
        expect(res.body.name).to.equal("Born to Win");       
          expect(res.body.artistId).to.equal(artist.id);
        expect(res.body.albumId).to.equal(album.id);
        done();
      })
      .catch((error) => done(error));
  });
});


it("returns a 404 and does not create a song if the album does not exist", (done) => {
  request(app)
    .post("/albums/1234/songs")
    .send({
      name: "I'm Blessed",
      year: 2011,
    })
    .then((res) => {
      expect(res.status).to.equal(404);

      expect(res.body.error).to.equal("The album could not be found.");

      Song.findAll()
        .then((songs) => {
          expect(songs.length).to.equal(0);
          done();
        })
        .catch((error) => done(error));
    })
    .catch((error) => done(error));
});

/*it("returns a 404 and does not create a song if the artist  does not exist", (done) => {
  request(app)
    .post(`/artists/1234/albums/12345/songs`)
    .send({
      name: "I'm Blessed",
    })
    .then((res) => {
      expect(res.status).to.equal(404);

      expect(res.body.error).to.equal("The artist could not be found.");

      Song.findAll()
        .then((songs) => {
          expect(songs.length).to.equal(3);
          done();
        })
        .catch((error) => done(error));
    })
    .catch((error) => done(error));
});*/


describe("with songs in the database", () => {
  let songs;
  beforeEach((done) => {
    Promise.all([
      Song.create({
        name: "Way Maker",
        year: album.year,
        artistId: artist.id,
        albumId: album.id,
      }),
      Song.create({
        name: "Heart of Worship",
        year: album.year,
        artistId: artist.id,
        albumId: album.id,
      }),
      Song.create({
        name: "When the Music Stops",
        year: album.year,
        artistId: artist.id,
        albumId: album.id,
      }),
    ]).then((documents) => {
      songs = documents;
      done();
    });
  });

  describe("GET /songs", () => {
    it("gets all songs records", (done) => {
      request(app)
        .get("/songs")
        .then((res) => {
          expect(res.status).to.equal(201);
          expect(res.body.length).to.equal(3);
          res.body.forEach((song) => {
            const expected = songs.find((a) => a.id === song.id);
            expect(song.name).to.equal(expected.name);
          });
          done();
        })
        .catch((error) => done(error));
    });

    describe("GET /songs/:songId", () => {
      it("gets songs by id", (done) => {
        const song = songs[0];
        request(app)
          .get(`/songs/${song.id}`)
          .then((res) => {
            expect(res.status).to.equal(200);
            expect(res.body.name).to.equal(song.name);
            expect(res.body.year).to.equal(song.year);
            done();
          })
          .catch((error) => done(error));
      });
    });

    

   


    describe("PATCH /songs/:id", () => {
      it("updates song name by id", (done) => {
        const song = songs[0];
        request(app)
          .patch(`/songs/${song.id}`)
          .send({ name: "The Name Of Jesus" })
          .then((res) => {
            expect(res.status).to.equal(200);
            Song.findByPk(song.id, { raw: true }).then((updatedSong) => {
              expect(updatedSong.name).to.equal("The Name Of Jesus");
              done();
            });
          })
          .catch((error) => done(error));
      });
    });
  });
  describe("DELETE /songs/:songId", () => {
    it("deletes song record by id", (done) => {
      const song = songs[0];
      request(app)
        .delete(`/songs/${song.id}`)
        .then((res) => {
          expect(res.status).to.equal(204);
          Song.findByPk(song.id, { raw: true }).then((updatedSong) => {
            expect(updatedSong).to.equal(null);
            done();
          });
        });
    });
  });
});
});