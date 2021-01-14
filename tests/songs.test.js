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
          done()
        })
        .catch((error) => done(error));
    });
  });
});

