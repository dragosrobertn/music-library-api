const { expect } = require("chai");
const request = require("supertest");
const app = require("../src/app");
const { Song } = require("../src/models");

describe("POST /album/:albumId/song", () => {
  it("creates a new song under an album", (done) => {
    request(app)
      .post(`/album/${album.id}/song`)
      .send({
        artist: artist.id,
        name: "Solitude Is Bliss",
      })
      .then((res) => {
        expect(res.status).to.equal(201);
        const songId = res.body.id;
        expect(res.body.id).to.equal(songId);
        expect(res.body.name).to.equal("Solitude Is Bliss");
        expect(res.body.artistId).to.equal(artist.id);
        expect(res.body.albumId).to.equal(album.id);
        done();
      });
  });
});
