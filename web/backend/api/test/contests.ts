import "mocha";
import request from "supertest";
import { expect } from "chai";
import Server from "../src/app";
import variables from "./variables";

describe("Contests", () => {
  it("Add a new contest", () =>
    request(Server)
      .post("/v1/contests")
      .set("Authorization", "bearer " + variables.admin.token)
      .send({
        type: "type",
        name: "name",
        year: 2019,
        enrollAvailable: false,
      })
      .expect(201));

  it("Update and get the contest with id 2", () =>
    request(Server)
      .put("/v1/contests/2")
      .set("Authorization", "bearer " + variables.admin.token)
      .send({
        name: "new name",
        enrollAvailable: true,
      })
      .expect(204)
      .then((r) =>
        request(Server)
          .get(r.header.location)
          .expect("Content-Type", /json/)
          .then((r) => {
            expect(r.body).to.be.an("object").to.include({
              name: "new name",
              enrollAvailable: true,
              totalTeams: 0,
            });
          })
      ));

  it("Get all contests", () =>
    request(Server)
      .get("/v1/contests")
      .expect("Content-Type", /json/)
      .then((r) => {
        expect(r.body).to.be.an("array").of.length(1);
      }));

  it("Delete the contest with id 2", () =>
    request(Server)
      .delete("/v1/contests/2")
      .set("Authorization", "bearer " + variables.admin.token)
      .expect(204)
      .then(() =>
        request(Server)
          .get("/v1/contests/2")
          .expect(404)
      ));
});
