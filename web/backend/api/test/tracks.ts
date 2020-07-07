import "mocha";
import request from "supertest";
import { expect } from "chai";
import Server from "../src/app";
import variables from "./variables";

describe("Tracks", () => {
  it("Create a new track", () =>
    request(Server)
      .post("/v1/tracks")
      .set("Authorization", "bearer " + variables.admin.token)
      .send({
        name: "testTrack",
        description: "A test Track",
        year: 2020,
        open: false,
      })
      .expect(201));

  it("Get all tracks", () =>
    request(Server)
      .get("/v1/tracks")
      .set("Authorization", "bearer " + variables.admin.token)
      .expect("Content-Type", /json/)
      .then((r) => {
        expect(r.body).to.be.an("array").of.length(1);
        expect(r.body[0]).to.be.an("object").that.has.property("id");
        variables.trackId = r.body[0].id;
      }));

  it("Join a track but failed", () =>
    request(Server)
      .post(`/v1/tracks/${variables.trackId}/players`)
      .set("Authorization", "bearer " + variables.user.token)
      .send({
        playerId: 2018000000,
      })
      .expect(403));

  it("Check if a player is in a track and fail", () =>
    request(Server)
      .get(`/v1/tracks/${variables.trackId}/players/2018000000`)
      .set("Authorization", "bearer " + variables.user.token)
      .expect(404));

  it("Update track", () =>
    request(Server)
      .put(`/v1/tracks/${variables.trackId}`)
      .set("Authorization", "bearer " + variables.admin.token)
      .send({
        open: true,
        preOpen: true,
      })
      .expect(204));

  it("Join a track and failed", () =>
    request(Server)
      .post(`/v1/tracks/${variables.trackId}/players`)
      .set("Authorization", "bearer " + variables.user.token)
      .send({
        playerId: 2018000000,
      })
      .expect(403));

  it("Join a track pre-contest and success", () =>
    request(Server)
      .post(`/v1/tracks/${variables.trackId}/prePlayers`)
      .set("Authorization", "bearer " + variables.user.token)
      .send({
        playerId: 2018000000,
      })
      .expect(204));
  it("Join a track and success", () =>
    request(Server)
      .post(`/v1/tracks/${variables.trackId}/players`)
      .set("Authorization", "bearer " + variables.user.token)
      .send({
        playerId: 2018000000,
      })
      .expect(204));

  it("Check if a player is in a track and success", () =>
    request(Server)
      .get(`/v1/tracks/${variables.trackId}/players/2018000000`)
      .set("Authorization", "bearer " + variables.user.token)
      .expect(200));

  it("Check if a pre-player is in a track and success", () =>
    request(Server)
      .get(`/v1/tracks/${variables.trackId}/prePlayers/2018000000`)
      .set("Authorization", "bearer " + variables.user.token)
      .expect(200));

  it("Check players", () =>
    request(Server)
      .get(`/v1/tracks/${variables.trackId}?playerInfo=true&prePlayerInfo=true`)
      .set("Authorization", "bearer " + variables.admin.token)
      .expect("Content-Type", /json/)
      .then((r) => {
        expect(r.body).to.be.an("object").that.has.property("players");
        expect(r.body.players).to.be.a("array").of.length(1);
        expect(r.body).to.be.an("object").that.has.property("prePlayers");
        expect(r.body.prePlayers).to.be.a("array").of.length(1);
      }));

  it("Join a track and failed by rejoin", () =>
    request(Server)
      .post(`/v1/tracks/${variables.trackId}/players`)
      .set("Authorization", "bearer " + variables.user.token)
      .send({
        playerId: 2018000000,
      })
      .expect(409));

  it("Exit a track's preTest and success", () =>
    request(Server)
      .delete(`/v1/tracks/${variables.trackId}/prePlayers/2018000000`)
      .set("Authorization", "bearer " + variables.user.token)
      .expect(204));

  it("Exit a track and success", () =>
    request(Server)
      .delete(`/v1/tracks/${variables.trackId}/players/2018000000`)
      .set("Authorization", "bearer " + variables.user.token)
      .expect(204));

  it("Delete the track", () =>
    request(Server)
      .delete(`/v1/tracks/${variables.trackId}`)
      .set("Authorization", "bearer " + variables.admin.token)
      .expect(204)
      .then(() =>
        request(Server)
          .get(`/v1/tracks/${variables.trackId}`)
          .set("Authorization", "bearer " + variables.admin.token)
          .expect(404)
      ));
});
