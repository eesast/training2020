import * as bcrypt from "bcrypt";
import dotenv from "dotenv";
import mongoose from "mongoose";
import "mocha";
import User from "../src/models/user";
import variables from "./variables";

dotenv.config();

before("Set up the database for testing", function (done) {
  this.timeout(15000);

  if (process.env.CI) {
    mongoose.connect(`mongodb://localhost:27017/sast-api-test`, {
      useNewUrlParser: true,
      useCreateIndex: true,
      useFindAndModify: false,
      useUnifiedTopology: true,
      user: "travis",
      pass: "test",
    });
  } else {
    mongoose.connect(
      `mongodb://localhost:27017/sast-api-test?authSource=admin`,
      {
        useNewUrlParser: true,
        useCreateIndex: true,
        useFindAndModify: false,
        useUnifiedTopology: true,
        user: process.env.DB_USER,
        pass: process.env.DB_PASS,
      }
    );
  }

  const db = mongoose.connection;
  db.once("open", async () => {
    await db.dropDatabase();
    done();
  });
});

before("Create admin user", async function () {
  this.timeout(10000);

  const admin = new User({
    id: 0,
    username: variables.admin.username,
    password: await bcrypt.hash(variables.admin.password, variables.saltRounds),
    email: "admin@eesast.com",
    name: "admin",
    phone: 0,
    department: "电子系",
    class: "无00",
    group: "admin",
    role: "root",
  });
  const testuser = new User({
    id: 2018000000,
    username: variables.user.username,
    password: await bcrypt.hash(variables.user.password, variables.saltRounds),
    email: "user@eesast.com",
    name: "user",
    phone: 13000000000,
    department: "电子工程系",
    class: "无80",
    group: "admin",
    role: "student",
  });

  return Promise.all([admin.save(), testuser.save()]);
});
