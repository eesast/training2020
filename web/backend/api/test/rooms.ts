import "mocha";
import request from "supertest";
import { expect } from "chai";
import Server from "../src/app";
import variables from "./variables";

describe("Rooms", () => {
  it("Add a new contest", () =>
    request(Server)
      .post("/v1/contests")
      .set("Authorization", "bearer " + variables.admin.token)
      .send({
        type: "test",
        name: "name",
        year: 2020,
        enrollAvailable: false,
      })
      .expect(201));

  it("Add a new room", () =>
    request(Server)
      .post("/v1/rooms")
      .set("Authorization", "bearer " + variables.admin.token)
      .send({
        contestId: 3,
        teams: [1],
        ip: "192.168.0.0",
        port: 8080,
      })
      .expect(201));

  it("Update, approve and get the room with id 1", () =>
    request(Server)
      .put("/v1/rooms/1")
      .set("Authorization", "bearer " + variables.admin.token)
      .send({
        teams: [-1, 1],
      })
      .expect(204)
      .then((r) =>
        request(Server)
          .get(r.header.location)
          .expect("Content-Type", /json/)
          .then((r) => {
            expect(r.body)
              .to.be.an("object")
              .that.has.property("teams")
              .to.be.an("array")
              .of.length(2);
          })
      ));

  it("Get all rooms", () =>
    request(Server)
      .get("/v1/rooms")
      .expect("Content-Type", /json/)
      .then((r) => {
        expect(r.body).to.be.an("array").of.length(1);
      }));

  it("Delete the room with id 1", () =>
    request(Server)
      .delete("/v1/rooms/1")
      .set("Authorization", "bearer " + variables.admin.token)
      .expect(204)
      .then(() =>
        request(Server)
          .get("/v1/rooms/1")
          .expect(404)
      ));

  it("Delete the contest with id 3", () =>
    request(Server)
      .delete("/v1/contests/3")
      .set("Authorization", "bearer " + variables.admin.token)
      .expect(204)
      .then(() =>
        request(Server)
          .get("/v1/contests/3")
          .expect(404)
      ));
});
