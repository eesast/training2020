import "mocha";
import request from "supertest";
import { expect } from "chai";
import Server from "../src/app";
import variables from "./variables";

describe("Codes", () => {
  it("Add a new contest", () =>
    request(Server)
      .post("/v1/contests")
      .set("Authorization", "bearer " + variables.admin.token)
      .send({
        type: "type",
        name: "name",
        year: 1453,
        enrollAvailable: true
      })
      .expect(201));

  it("Add a new Team", () =>
    request(Server)
      .post("/v1/teams")
      .set("Authorization", "bearer " + variables.admin.token)
      .send({
        contestId: 1,
        name: "teamName",
        description: "description",
        leader: 0,
        members: [0]
      })
      .expect(201));

  it("Add a new code", () =>
    request(Server)
      .post("/v1/codes")
      .set("Authorization", "bearer " + variables.admin.token)
      .send({
        name: "codeName",
        contestId: 1,
        teamId: 1,
        content: 'print("hello world")',
        language: "py"
      })
      .expect(201));

  it("Update, approve and get the code with id 1", () =>
    request(Server)
      .put("/v1/codes/1")
      .set("Authorization", "bearer " + variables.admin.token)
      .send({
        name: "new codeName",
        content: 'print("hello world")',
        language: "py"
      })
      .expect(204)
      .then(r => {
        request(Server)
          .get(r.header.location)
          .set("Authorization", "bearer " + variables.admin.token)
          .expect("Content-Type", /json/)
          .then(r => {
            expect(r.body)
              .to.be.an("object")
              .that.has.property("name")
              .equal("new codeName");
          });
      }));

  it("Get all codes", () =>
    request(Server)
      .get("/v1/codes")
      .set("Authorization", "bearer " + variables.admin.token)
      .expect("Content-Type", /json/)
      .then(r => {
        expect(r.body)
          .to.be.an("array")
          .of.length(1);
      }));

  it("Delete the team with id 1", () =>
    request(Server)
      .delete("/v1/teams/1")
      .set("Authorization", "bearer " + variables.admin.token)
      .expect(204)
      .then(() =>
        request(Server)
          .get("/v1/teams/1")
          .set("Authorization", "bearer " + variables.admin.token)
          .expect(404)
      ));

  it("Delete the contest with id 1", () =>
    request(Server)
      .delete("/v1/contests/1")
      .set("Authorization", "bearer " + variables.admin.token)
      .expect(204)
      .then(() =>
        request(Server)
          .get("/v1/contests/1")
          .expect(404)
      ));
});
