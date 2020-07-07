import "mocha";
import request from "supertest";
import Server from "../src/app";
import variables from "./variables";

describe("Static", () => {
  it("Upload file", () =>
    request(Server)
      .post("/static/files")
      .set("Authorization", "bearer " + variables.admin.token)
      .set("Content-Type", "multipart/form-data")
      .attach("file", "docs/swagger.yaml")
      .expect(201));

  it("Download file", () =>
    request(Server).get("/static/files/swagger.yaml").expect(200));

  it("Delete file", () =>
    request(Server)
      .delete("/static/files/swagger.yaml")
      .set("Authorization", "bearer " + variables.admin.token)
      .expect(204)
      .then(() =>
        request(Server).get("/static/files/swagger.yaml").expect(404)
      ));
});
