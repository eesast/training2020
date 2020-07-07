import express from "express";
import Docker from "dockerode";
import * as fs from "fs";
import jwt from "jsonwebtoken";
import secret from "../configs/secret";
import { server } from "../configs/docker";
import authenticate from "../middlewares/authenticate";
import checkServer from "../middlewares/checkServer";
import Code from "../models/code";
import Team from "../models/team";
import pick from "lodash.pick";

const router = express.Router();

/**
 * GET codes with queries
 * @param {number} contestId
 * @param {number} teamId
 * @param {number} begin
 * @param {number} end
 * @returns {Object[]} certain codes
 */
router.get("/", authenticate([]), async (req, res, next) => {
  try {
    const query = {
      ...pick(req.query, ["contestId", "teamId"]),
    };

    const begin = parseInt(req.query.begin as string, 10) || 0;
    const end =
      parseInt(req.query.end as string, 10) || Number.MAX_SAFE_INTEGER;
    const select = "-_id -__v";

    const userId = req.auth.id;
    if (query.teamId) {
      const team = await Team.findOne({ id: query.teamId });
      if (!team) {
        return res.status(404).send("404 Not Found: Team does not exist");
      } else if (
        team.members.includes(userId!) ||
        req.auth.role === "root" ||
        req.auth.role === "organizer"
      ) {
        const codes = await Code.find({ ...query } as any, select, {
          skip: begin,
          limit: end - begin + 1,
          sort: "-createdAt",
        });
        return res.json(codes);
      } else {
        return res
          .status(403)
          .send("403 Forbidden: You have no access to codes");
      }
    } else if (
      query.contestId &&
      (req.auth.role === "root" || req.auth.role === "organizer")
    ) {
      const codes = await Code.find({ ...query } as any, select, {
        skip: begin,
        limit: end - begin + 1,
        sort: "-createdAt",
      });
      return res.json(codes);
    } else {
      if (req.auth.role === "root") {
        const codes = await Code.find({ ...query } as any, select, {
          skip: begin,
          limit: end - begin + 1,
          sort: "-createdAt",
        });
        return res.json(codes);
      }
      return res.status(422).send("422 UnProcessable Entity: Missing contents");
    }
  } catch (error) {
    next(error);
  }
});

/**
 * GET code of Id
 * @param {number} id
 * @returns {Object} code with id
 */
router.get("/:id", authenticate([]), async (req, res, next) => {
  try {
    const userId = req.auth.id;

    const code = await Code.findOne({ id: req.params.id }, "-_id -__v");
    if (!code) {
      return res.status(404).send("404 Not Found: Code does not exist");
    }

    const team = await Team.findOne({ id: code?.teamId });

    if (team?.members.includes(userId!)) {
      res.json(code);
    } else {
      res.status(403).send("403 Forbidden: You have no access to the code");
    }
  } catch (err) {
    next(err);
  }
});

/**
 * POST new code
 * @returns Location header
 */
router.post("/", authenticate(["root", "self"]), async (req, res, next) => {
  try {
    if (req.body.content === "") {
      return res.status(422).send("422 UnProcessable Entity: Missing contents");
    }

    const team = await Team.findOne({ id: req.body.teamId });
    if (!team) {
      return res.status(404).send("404 Not Found: Team does not exist");
    } else if (team.contestId !== req.body.contestId) {
      return res
        .status(403)
        .send("403 Forbidden: Team and Contest do not match");
    } else if (
      !team.members.includes(req.auth.id!) &&
      req.auth.role !== "root"
    ) {
      return res.status(403).send("403 Forbidden: You have no access");
    }

    const code = await new Code({
      ...req.body,
      createdBy: req.auth.id,
      updatedBy: req.auth.id,
    }).save();

    res.setHeader("Location", "/v1/codes/" + code.id);
    res.status(201).end();
  } catch (error) {
    next(error);
  }
});

/**
 * POST compile code
 * @param {number} id
 * @returns Success or Logs
 */
router.post(
  "/:id/compile",
  authenticate(["root", "self"]),
  async (req, res) => {
    try {
      const code = await Code.findOne({ id: req.params.id });

      const role = req.body.role ? req.body.role : 0;

      if (!code) {
        return res.status(404).send("404 Not Found: Code does not exist");
      } else {
        const docker = new Docker();
        // 判断是否存在正在运行的目标container
        const containers = await docker.listContainers();
        let containerExist = false;
        containers.forEach((containerInfo) => {
          if (containerInfo.Names.includes(`THUAI_Compiler_${code.id}`)) {
            containerExist = true;
          }
        });

        if (!containerExist) {
          await new Promise((resolve, reject) => {
            fs.mkdir(
              `/data/thuai/${code.teamId}`,
              {
                recursive: true,
                mode: 0o775,
              },
              (err, path) => {
                if (err) reject(err);
                else resolve(path);
              }
            );
          });

          await new Promise((resolve, reject) => {
            fs.writeFile(
              `/data/thuai/${code.teamId}/player.cpp`,
              code.content,
              "utf8",
              (err) => {
                if (err) reject(err);
                else resolve("success");
              }
            );
          });

          const token = jwt.sign({ codeId: code.id, server }, secret, {
            expiresIn: "12h",
          });

          const compileContainer = await docker.createContainer({
            Image: "eesast/thuai_compiler:latest",
            HostConfig: {
              Binds: [`/data/thuai/${code.teamId}:/usr/local/mnt`],
              // NetworkMode: "host", //本地测试时使用host模式
            },
            Cmd: ["sh", "/usr/local/CAPI/compile.sh"],
            Env: [
              `THUAI_COMPILE_TOKEN=${token}`,
              `THUAI_CODEID=${code.id}`,
              `THUAI_CODEROLE=${role}`,
            ],
            name: `THUAI_Compiler_${code.id}`,
            AttachStdin: false,
            AttachStdout: false,
            AttachStderr: false,
          });
          await compileContainer.start();
          return res.status(200).send("200 Success: Compile Start");
        } else {
          return res.status(409).send("409 Conflict: Code is compiling");
        }
      }
    } catch (error) {
      return res.status(400);
    }
  }
);

/**
 * PUT existing code compile info
 * @param {number} id
 * @returns {String} Location header or Not Found
 */
router.put("/:id/compile", checkServer, async (req, res, next) => {
  try {
    const code = await Code.findOne({ id: req.params.id });

    if (!code) {
      return res.status(404).send("404 Not Found: Code does not exist");
    }

    if (!req.body.compileInfo) {
      return res
        .status(422)
        .send("422 Unprocessable Entity: Missing form data");
    }

    const docker = new Docker();

    // const containers = await docker.listContainers();
    // let containerExist = false;
    // containers.forEach(containerInfo => {
    //   if (containerInfo.Names.includes(`THUAI_Compiler_${code.id}`)) {
    //     containerExist = true;
    //   }
    // });

    // if (!containerExist) {
    //   console.log("container not found");
    // docker发出消息后自动终止了，这里并无法列出
    // return res
    //   .status(404)
    //   .send("404 Not Found: Docker container does not exist");
    // }

    try {
      const container = docker.getContainer(`THUAI_Compiler_${code.id}`);
      const info = await container.inspect();
      if (info.State.Running) {
        await container.stop();
      }
      await container.remove();
    } catch (error) {
      return res
        .status(503)
        .send(
          "503 Service Unavailable: Failed to stop or remove docker container"
        );
    }

    if (req.body.compileInfo !== "compile success") {
      try {
        const compileInfo = await new Promise<string>((resolve, reject) => {
          fs.readFile(`/data/thuai/${code.teamId}/error.txt`, (err, data) => {
            if (err) reject(err);
            else resolve(data.toString("utf8"));
          });
        });

        const update = {
          ...{ compileInfo: compileInfo },
          updatedAt: new Date(),
          updatedBy: req.auth.id,
        };
        const newCode = await Code.findOneAndUpdate(
          { id: req.params.id },
          update
        );
        // 此时container已被删除，log中不会有状态码
        res.setHeader("Location", "/v1/codes/" + newCode!.id);
        res.status(204).end();
      } catch (error) {
        return res
          .status(503)
          .send(
            "503 Service Unavailable: Failed to read compileInfo or Update compileInfo"
          );
      }
    } else {
      const update = {
        ...{ compileInfo: req.body.compileInfo },
        updatedAt: new Date(),
        updatedBy: req.auth.id,
      };
      const newCode = await Code.findOneAndUpdate(
        { id: req.params.id },
        update
      );
      // 此时container已被删除，log中不会有状态码
      res.setHeader("Location", "/v1/codes/" + newCode!.id);
      res.status(204).end();
    }
  } catch (error) {
    next(error);
  }
});

/**
 * PUT existing code
 * @param {number} id
 * @returns Location header or Not Found
 */
router.put(
  "/:id",
  authenticate(["root", "self", "organizer"]),
  async (req, res, next) => {
    try {
      const code = await Code.findOne({ id: req.params.id });

      if (!code) {
        return res.status(404).send("404 Not Found: Code does not exist");
      }

      const team = await Team.findOne({ id: code.teamId! });
      if (!team) {
        return res.status(404).send("404 Not Found: Team does not exist");
      }

      if (!team.members.includes(req.auth.id!) || req.auth.role !== "root") {
        return res.status(403).send("404 Not Found: Team does not exist");
      }

      const update = {
        ...req.body,
        updatedAt: new Date(),
        updatedBy: req.auth.id,
      };
      const newCode = await Code.findOneAndUpdate(
        { id: req.params.id },
        update
      );
      res.setHeader("Location", "/v1/codes/" + newCode!.id);
      res.status(204).end();
    } catch (error) {
      next(error);
    }
  }
);

/**
 * DELETE a code of id
 * @param {Number} id
 * @returns No Content or Not Found
 */
router.delete(
  "/:id",
  authenticate(["root", "self"]),
  async (req, res, next) => {
    try {
      if (req.auth.selfCheckRequired) {
        const teamId = (await Code.findOne({ id: req.params.id }))?.teamId;

        if (
          !(await Team.findOne({ id: teamId }))?.members.includes(req.auth.id!)
        ) {
          return res.status(403).send("404 Not Found: Team does not exist");
        }
      }

      const deleteCode = await Code.findOneAndDelete({ id: req.params.id });

      if (!deleteCode) {
        return res.status(404).send("404 Not Found: Article does not exist");
      }

      res.status(204).end();
    } catch (error) {
      next(error);
    }
  }
);

export default router;
