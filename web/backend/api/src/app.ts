import cors from "cors";
import express from "express";
import logger from "morgan";
import path from "path";
import { OpenApiValidator } from "express-openapi-validator";
import errorHandler from "./middlewares/errorHandler";
import serverConfig from "./configs/server";
import announcementRouter from "./routes/announcements";
import articleRouter from "./routes/articles";
import commentRouter from "./routes/comments";
import contestRouter from "./routes/contests";
import staticRouter from "./routes/static";
import teamRouter from "./routes/teams";
import userRouter from "./routes/users";
import emailRouter from "./routes/emails";
import roomRouter from "./routes/rooms";
import trackRouter from "./routes/tracks";
import codeRouter from "./routes/codes";

const app = express();

(async () => {
  const whitelist = [
    "https://eesast.com",
    "https://api.eesast.com",
    "https://graphql.eesast.com",
    "https://info.eesast.com",
    "https://thu-ai.net",
    "http://140.143.170.135",
    "http://140.143.170.135:3000",
  ];

  const devWhitelist = [...whitelist, "http://localhost:3000"];

  app.use(
    cors({
      origin: function (origin, callback) {
        if (
          !origin ||
          (process.env.NODE_ENV === "production"
            ? whitelist
            : devWhitelist
          ).indexOf(origin) !== -1
        ) {
          callback(null, true);
        } else {
          callback(new Error("Not allowed by CORS"));
        }
      },
    })
  );

  app.use(logger(process.env.NODE_ENV === "production" ? "combined" : "dev"));
  app.use(express.json({ limit: "50mb" }));
  app.use(express.urlencoded({ limit: "50mb", extended: true }));

  app.use("/static", staticRouter);
  app.use("/static", express.static(serverConfig.staticFilePath));
  app.use("/v1", express.static(path.resolve(__dirname, "../docs")));

  // install the Open-Api Validator
  const apiSpec = path.resolve(__dirname, "../docs/swagger.yaml");
  await new OpenApiValidator({
    apiSpec,
  }).install(app);

  app.use("/v1/articles", articleRouter);
  app.use("/v1/comments", commentRouter);
  app.use("/v1/contests", contestRouter);
  app.use("/v1/users", userRouter);
  app.use("/v1/teams", teamRouter);
  app.use("/v1/announcements", announcementRouter);
  app.use("/v1/emails", emailRouter);
  app.use("/v1/rooms", roomRouter);
  app.use("/v1/tracks", trackRouter);
  app.use("/v1/codes", codeRouter);

  app.use(errorHandler);
})();

export default app;
