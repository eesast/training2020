import "mocha";
import request from "supertest";
import { expect } from "chai";
import Server from "../src/app";
import variables from "./variables";

describe("Articles", () => {
  it("Add a new article", () =>
    request(Server)
      .post("/v1/articles")
      .set("Authorization", "bearer " + variables.admin.token)
      .send({
        title: "title",
        alias: "alias",
        authorId: 0,
        content: "content",
        abstract: "abstract",
        image: "",
        tags: ["test"],
        visible: false,
      })
      .expect(201));

  it("Update, approve and get the article with id 1", () =>
    request(Server)
      .put("/v1/articles/1")
      .set("Authorization", "bearer " + variables.admin.token)
      .send({
        title: "new title",
        visible: true,
      })
      .expect(204)
      .then((r) =>
        request(Server)
          .get(r.header.location)
          .expect("Content-Type", /json/)
          .then((r) => {
            expect(r.body)
              .to.be.an("object")
              .that.has.property("title")
              .equal("new title");
          })
      ));

  it("Get all articles", () =>
    request(Server)
      .get("/v1/articles")
      .expect("Content-Type", /json/)
      .then((r) => {
        expect(r.body).to.be.an("array").of.length(1);
      }));

  it("Like the article with id 1", () =>
    request(Server)
      .get("/v1/articles/1/like")
      .set("Authorization", "bearer " + variables.admin.token)
      .expect(204)
      .then(() =>
        request(Server)
          .get("/v1/articles/1")
          .expect("Content-Type", /json/)
          .then((r) => {
            expect(r.body.likers).to.be.an("array").that.contains(0);
          })
      ));

  it("Unlike the article with id 1", () =>
    request(Server)
      .get("/v1/articles/1/unlike")
      .set("Authorization", "bearer " + variables.admin.token)
      .expect(204)
      .then(() =>
        request(Server)
          .get("/v1/articles/1")
          .expect("Content-Type", /json/)
          .then((r) => {
            expect(r.body.likers).to.be.an("array").that.not.contains(0);
          })
      ));

  it("Delete the article with id 1", () =>
    request(Server)
      .delete("/v1/articles/1")
      .set("Authorization", "bearer " + variables.admin.token)
      .expect(204)
      .then(() => request(Server).get("/v1/articles/1").expect(404)));
});
