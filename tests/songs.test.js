const { expect } = require("chai");
const request = require("supertest");
const app = require("../src/app");
const { Artist, Album, Song } = require("../src/models");

describe("/songs", () => {
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

  describe("with songs in the database", () => {
    let songs;
    beforeEach((done) => {
      Promise.all([
        Song.create({
          name: "Way Maker",
          // year: album.year,
          artistId: artist.id,
          albumId: album.id,
        }),
        Song.create({
          name: "Heart of Worship",
          // year: album.year,
          artistId: artist.id,
          albumId: album.id,
        }),
        Song.create({
          name: "When the Music Stops",
          // year: album.year,
          artistId: artist.id,
          albumId: album.id,
        }),
      ]).then((documents) => {
        songs = documents;
        done();
      });
    });
  });

  describe("GET /songs", () => {
    it("gets all songs records", (done) => {
      request(app)
        .get("/songs")
        .then((res) => {
          expect(res.status).to.equal(201);
          expect(res.body.length).to.equal(0);
          res.body.forEach((song) => {
            const expected = songs.find((a) => a.id === song.id);
            expect(song.name).to.equal(expected.name);
          });
          done();
        })
        .catch((error) => done(error));
    });
  });

})