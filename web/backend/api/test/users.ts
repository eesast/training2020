import "mocha";
import request from "supertest";
import { expect } from "chai";
import Server from "../src/app";
import variables from "./variables";

describe("Users", () => {
  it("Add a new user", () =>
    request(Server)
      .post("/v1/users")
      .send({
        id: 2017000000,
        username: "test",
        password: "pass",
        email: "test@eesast.com",
        name: "test",
        phone: 0,
        department: "string",
        class: "string",
      })
      .expect(201));

  it("Log in Normal User", () =>
    request(Server)
      .post("/v1/users/login")
      .send({
        username: variables.user.username,
        password: variables.user.password,
      })
      .expect("Content-Type", /json/)
      .then((r) => {
        expect(r.body).to.be.an("object").that.has.property("token");
        variables.user.token = r.body.token;
      }));

  it("Log in", () =>
    request(Server)
      .post("/v1/users/login")
      .send({
        username: variables.admin.username,
        password: variables.admin.password,
      })
      .expect("Content-Type", /json/)
      .then((r) => {
        expect(r.body).to.be.an("object").that.has.property("token");
        variables.admin.token = r.body.token;
      }));

  const allowedEndpoints = [
    {
      path: "/v1/users/",
      methods: ["GET"],
    },
    {
      path: "/v1/users/:id",
      methods: ["GET"],
    },
    {
      path: "/v1/users/details",
      methods: ["POST"],
    },
    {
      path: "/v1/users/token/validate",
      methods: ["POST"],
    },
  ];

  it("Apply Public Token", () =>
    request(Server)
      .post("/v1/users/token/apply?userId=2017000000")
      .set("Authorization", "bearer " + variables.admin.token)
      .send({ allowedEndpoints })
      .expect("Content-Type", /json/)
      .then((r) => {
        expect(r.body).to.be.an("object").that.has.property("token");
        variables.publicToken = r.body.token;
      }));

  // it("Apply Public Token again", () =>
  //   request(Server)
  //     .post("/v1/users/token/apply?id=2017000000")
  //     .set("Authorization", "bearer " + variables.publicToken)
  //     .send({ allowedEndpoints })
  //     .expect("Content-Type", /json/)
  //     .then(r => {
  //       expect(r.body)
  //         .to.be.an("object")
  //         .that.has.property("token");
  //       variables.publicToken = r.body.token;
  //     }));

  it("Validate Token", () =>
    request(Server)
      .post("/v1/users/token/validate")
      .send({ token: variables.publicToken })
      .expect(200)
      .expect("Content-Type", /json/)
      .then((r) => {
        expect(r.body).to.be.an("object").that.has.property("id");
        expect(r.body).has.property("allowedEndpoints");
      }));

  it("Get all users", () =>
    request(Server)
      .get("/v1/users")
      .set("Authorization", "bearer " + variables.admin.token)
      .expect("Content-Type", /json/)
      .then((r) => {
        expect(r.body).to.be.an("array").of.length(3);
      }));

  it("get the user with id 2017000000", () =>
    request(Server)
      .get("/v1/users/2017000000")
      .set("Authorization", "bearer " + variables.publicToken)
      .expect("Content-Type", /json/)
      .then((r) => {
        expect(r.body).to.be.an("object").has.property("id");
        expect(r.body.id).to.be.equals(2017000000);
      }));

  it("Update and get the user with id 2017000000", () =>
    request(Server)
      .put("/v1/users/2017000000")
      .set("Authorization", "bearer " + variables.admin.token)
      .send({
        name: "new name",
      })
      .expect(204)
      .then((r) =>
        request(Server)
          .get(r.header.location + "?detailInfo=true")
          .set("Authorization", "bearer " + variables.admin.token)
          .expect("Content-Type", /json/)
          .then((r) => {
            expect(r.body)
              .to.be.an("object")
              .that.has.property("name")
              .equal("new name");
          })
      ));

  it("Delete the user with id 2017000000", () =>
    request(Server)
      .delete("/v1/users/2017000000")
      .set("Authorization", "bearer " + variables.admin.token)
      .expect(204)
      .then(() =>
        request(Server)
          .get("/v1/users/2017000000")
          .set("Authorization", "bearer " + variables.admin.token)
          .expect(404)
      ));
});
