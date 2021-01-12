const { expect } = require("chai");
const request = require("supertest");
const { Artist } = require("../src/models");
const app = require("../src/app");

describe("/artists", () => {
  before(async () => {
    try {
      await Artist.sequelize.sync();
    } catch (err) {
      console.log(err);
    }
  });

  beforeEach(async () => {
    try {
      await Artist.destroy({ where: {} });
    } catch (err) {
      console.log(err);
    }
  });

  describe("POST /artists", async () => {
    it("creates a new artist in the database", async () => {
      const response = await request(app).post("/artists").send({
        name: "Sinach",
        genre: "Worship",
      });

      await expect(response.status).to.equal(201);
      expect(response.body.name).to.equal("Sinach");

      const insertedArtistRecords = await Artist.findByPk(response.body.id, {
        raw: true,
      });
      expect(insertedArtistRecords.name).to.equal("Sinach");
      expect(insertedArtistRecords.genre).to.equal("Worship");
    });
  });

  describe("with artists in the database", () => {
    let artists;
    beforeEach((done) => {
      Promise.all([
        Artist.create({ name: "Sinach", genre: "Worship" }),
        Artist.create({ name: "Matt Redman", genre: "Worship" }),
        Artist.create({ name: "Lecrae", genre: "Hip-Hop" }),
      ]).then((documents) => {
        artists = documents;
        done();
      });
    });

    describe("GET /artists", () => {
      it("gets all artist records", (done) => {
        request(app)
          .get("/artists")
          .then((res) => {
            expect(res.status).to.equal(200);
            expect(res.body.length).to.equal(3);
            res.body.forEach((artist) => {
              const expected = artists.find((a) => a.id === artist.id);
              expect(artist.name).to.equal(expected.name);
              expect(artist.genre).to.equal(expected.genre);
            });
            done();
          });
      });
      describe("GET /artists/:artistId", () => {
        it("gets artist record by id", (done) => {
          const artist = artists[0];
          request(app)
            .get(`/artists/${artist.id}`)
            .then((res) => {
              expect(res.status).to.equal(200);
              expect(res.body.name).to.equal(artist.name);
              expect(res.body.genre).to.equal(artist.genre);
              done();
            });
        });
      });

      describe("PATCH /artists/:id", () => {
        it("updates artist genre by id", (done) => {
          const artist = artists[0];
          request(app)
            .patch(`/artists/${artist.id}`)
            .send({ genre: "Christian Hip-Hop" })
            .then((res) => {
              expect(res.status).to.equal(200);
              Artist.findByPk(artist.id, { raw: true }).then(
                (updatedArtist) => {
                  expect(updatedArtist.genre).to.equal("Christian Hip-Hop");
                  done();
                }
              );
            });
        });
        it("updates artist name by id", (done) => {
          const artist = artists[0];
          request(app)
            .patch(`/artists/${artist.id}`)
            .send({ name: "Hillsong" })
            .then((res) => {
              expect(res.status).to.equal(200);
              Artist.findByPk(artist.id, { raw: true }).then(
                (updatedArtist) => {
                  expect(updatedArtist.name).to.equal("Hillsong");
                  done();
                }
              );
            });
        });
      });

      describe("DELETE /artists/:artistId", () => {
        it("deletes artist record by id", (done) => {
          const artist = artists[0];
          request(app)
            .delete(`/artists/${artist.id}`)
            .then((res) => {
              expect(res.status).to.equal(204);
              Artist.findByPk(artist.id, { raw: true }).then(
                (updatedArtist) => {
                  expect(updatedArtist).to.equal(null);
                  done();
                }
              );
            });
        });
      });
    });
  });
});
