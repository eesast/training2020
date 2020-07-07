import express from "express";
import jwt from "jsonwebtoken";
import Docker from "dockerode";
import secret from "../configs/secret";
import { image, server } from "../configs/docker";
import authenticate from "../middlewares/authenticate";
import checkServer from "../middlewares/checkServer";
import Contest from "../models/contest";
import Room, { ServerToken } from "../models/room";
import Team from "../models/team";
import User from "../models/user";
import pick from "lodash.pick";

const router = express.Router();

/**
 * GET rooms with queries
 * @param {number} contestId
 * @param {number} status
 * @param {number} begin
 * @param {number} end
 * @returns {Object[]} rooms of given contest with given status
 */
router.get("/", async (req, res, next) => {
  const query = pick(req.query, ["contestId", "status"]);

  try {
    const rooms = await Room.find(query as any, "-_id -__v");
    res.json(rooms);
  } catch (err) {
    next(err);
  }
});

/**
 * GET room of id
 * @param {Number} id
 * @returns {Object} room with id
 */
router.get("/:id", async (req, res, next) => {
  try {
    const room = await Room.findOne({ id: req.params.id }, "-_id -__v");

    if (!room) {
      return res.status(404).send("404 Not Found: Room does not exist");
    }

    res.json(room);
  } catch (err) {
    next(err);
  }
});

/**
 * POST join room of Id
 * @param {number} id
 * @returns {Object} teams in room with id
 */
router.post("/:id/join", checkServer, async (req, res, next) => {
  try {
    const room = await Room.findOne({ id: req.params.id });
    if (!room) {
      return res.status(404).send("404 Not Found: Room does not exist");
    }

    let userId = 0;
    try {
      const decoded = jwt.verify(req.body.token, secret) as { id: number };
      User.findOne({ id: decoded.id }, (error, user) => {
        if (error) {
          return res.status(500).end();
        }
        if (!user || !decoded.id) {
          return res.status(404).send("404 Not Found: User does not exist");
        }
      });
      userId = decoded.id;
    } catch {
      return res.status(401).send("401 Unauthorized: Wrong token");
    }

    const team = await Team.findOne({
      contestId: room.contestId,
      members: { $in: [userId] },
    });
    if (!team) {
      return res.status(400).send("400 Bad Request: User not in team");
    }
    if (room.teams.includes(team.id)) {
      return res.status(409).send("409 Conflict: Team already in room");
    }
    const teams = room.teams.concat([team.id]);
    const update = { updatedAt: new Date(), updatedBy: req.auth.id, teams };
    const newRoom = await Room.findOneAndUpdate({ id: req.params.id }, update);
    if (!newRoom) {
      return res.status(404).send("404 Not Found: Room does not exist");
    }

    res.json(teams);
  } catch (err) {
    next(err);
  }
});

/**
 * POST leave room of Id
 * @param {number} id
 * @returns teams in room with id
 */
router.post("/:id/leave", checkServer, async (req, res, next) => {
  try {
    const room = await Room.findOne({ id: req.params.id });
    if (!room) {
      return res.status(404).send("404 Not Found: Room does not exist");
    }

    let userId = 0;
    try {
      const decoded = jwt.verify(req.body.token, secret) as { id: number };
      User.findOne({ id: decoded.id }, (error, user) => {
        if (error) {
          return res.status(500).end();
        }
        if (!user || !decoded.id) {
          return res.status(404).send("404 Not Found: User does not exist");
        }
      });
      userId = decoded.id;
    } catch {
      return res.status(401).send("401 Unauthorized: Wrong token");
    }

    const team = await Team.findOne({
      contestId: room.contestId,
      members: { $in: [userId] },
    });
    if (!team) {
      return res.status(400).send("400 Bad Request: User not in team");
    }
    const index = room.teams.indexOf(team.id);
    if (index === -1) {
      return res.status(404).send("404 Not Found: Team does not exist");
    }
    room.teams.splice(index, 1);
    const update = {
      updatedAt: new Date(),
      updatedBy: req.auth.id,
      teams: room.teams,
    };
    const newRoom = await Room.findOneAndUpdate({ id: req.params.id }, update);
    if (!newRoom) {
      return res.status(404).send("404 Not Found: Room does not exist");
    }

    res.json(room.teams);
  } catch (err) {
    next(err);
  }
});

/**
 * POST new Room
 * @returns {String} Location header
 */
router.post("/", authenticate([]), async (req, res, next) => {
  const body = pick(req.body, ["contestId", "ip", "port"]); // ip 由 docker 分配; teams 由 agent 连上后进行更新
  const port = body.port;

  try {
    const contest = await Contest.findOne({ id: req.body.contestId });
    if (!contest) {
      return res.status(400).send("400 Bad Request: Contest not available");
    }

    const room = await new Room({
      ...body,
      teams: [] as number[],
      createdBy: req.auth.id,
      updatedBy: req.auth.id,
    }).save();

    const token = jwt.sign({ roomId: room.id, server }, secret, {
      expiresIn: "12h",
    });

    if (process.env.NODE_ENV === "production") {
      const docker = new Docker();
      let roomIp = "";
      try {
        await docker.createNetwork({
          name: `THUAI-RoomNet${room.id}`,
        });
        const container = await docker.createContainer({
          Image: image,
          Cmd: [
            "--port",
            `${port}`,
            "--debugLevel",
            "0",
            "--playerCount",
            "2",
            "--agentCount",
            `${req.body.teams.length}`,
            "--gameTime",
            "600",
            "--token",
            `${token}`,
          ],
          AttachStdin: false,
          AttachStdout: false,
          AttachStderr: false,
          ExposedPorts: { [`${port}/tcp`]: {} },
          HostConfig: {
            // PortBindings: { [`${port}/tcp`]: [{ HostPort: `${port}` }] },
            NetworkMode: `THUAI-RoomNet${room.id}`,
          },
          Tty: false,
          OpenStdin: false,
          StdinOnce: false,
          name: `THUAI-Room${room.id}`,
        });
        await container.start();

        const network = docker.getNetwork(`THUAI-RoomNet${room.id}`);
        const netInfo = (await network.inspect()) as Docker.NetworkInspectInfo;
        const containerInfo = Object.values(netInfo.Containers!)[0];
        // dockerode type 有问题，IPv4是正确的
        roomIp = (containerInfo as any).IPv4Address.split("/")[0];

        console.log("updateIp");

        await Room.findOneAndUpdate(
          { id: room.id },
          { ip: roomIp, updatedAt: new Date() }
        );
      } catch {
        return res
          .status(503)
          .send("503 Service Unavailable: Failed to start docker container");
      }

      try {
        for (let i = 0; i < req.body.teams.length; i++) {
          const teamId = req.body.teams[i];
          const team = await Team.findOne({ id: teamId });
          const agentToken = jwt.sign(
            {
              id: team?.leader,
            },
            secret,
            {
              expiresIn: "12h",
            }
          );
          const agent = await docker.createContainer({
            Image: "eesast/thuai_agentclient",
            HostConfig: {
              Binds: [`/data/thuai/${teamId}:/usr/local/mnt`],
              NetworkMode: `THUAI-RoomNet${room.id}`,
            },
            AttachStdin: false,
            AttachStdout: false,
            AttachStderr: false,
            Tty: false,
            OpenStdin: false,
            StdinOnce: false,
            name: `THUAI-Room${room.id}-${teamId}`,
            Cmd: [roomIp + `:${body.port}`, "2", "1", "600", `${agentToken}`],
          });
          await agent.start();
        }
      } catch (error) {
        return res
          .status(503)
          .send("503 Service Unavailable: Failed to start docker container");
      }
    }
    res.setHeader("Location", "/v1/rooms/" + room.id);
    res.status(201).end();
  } catch (err) {
    next(err);
  }
});

/**
 * POST check token for starting server
 * @param {string} token
 * @returns 204 or 401
 */
router.post("/check/:token", async (req, res) => {
  try {
    const payload = jwt.verify(req.params.token, secret) as ServerToken;
    const room = await Room.findOne({ id: payload.roomId });
    if (!room) {
      return res.status(401).send("401 Unauthorized: Wrong token");
    }

    await room.updateOne({
      status: 1,
      updatedAt: new Date(),
    });

    res.status(204).end();
  } catch (err) {
    res.status(401).send("401 Unauthorized: Wrong token");
  }
});

/**
 * PUT existing Room
 * @param {Number} id - updating Room's id
 * @returns {String} Location header or Not Found
 */
router.put(
  "/:id",
  authenticate(["root", "organizer"]),
  async (req, res, next) => {
    try {
      const room = await Room.findOne({ id: req.params.id });

      if (!room) {
        return res.status(404).send("404 Not Found: Room does not exist");
      }

      const update = {
        ...req.body,
        updatedAt: new Date(),
        updatedBy: req.auth.id,
      };

      const newRoom = await Room.findOneAndUpdate(
        { id: req.params.id },
        update
      );

      res.setHeader("Location", "/v1/rooms/" + newRoom!.id);
      res.status(204).end();
    } catch (err) {
      next(err);
    }
  }
);

/**
 * PUT existing Room status
 * @param {Number} id - updating Room's id
 * @returns {String} Location header or Not Found
 */
router.put("/:id/status", checkServer, async (req, res, next) => {
  try {
    const room = await Room.findOne({ id: req.params.id });

    if (!room) {
      return res.status(404).send("404 Not Found: Room does not exist");
    }

    if (!req.body.status) {
      return res
        .status(422)
        .send("422 Unprocessable Entity: Missing form data");
    }

    if (process.env.NODE_ENV === "production") {
      if (req.body.status === 2) {
        try {
          const docker = new Docker();
          const container = docker.getContainer(`THUAI-Room${room.id}`);
          if (!container) {
            return res
              .status(404)
              .send("404 Not Found: Docker container does not exist");
          }
          const info = await container.inspect();
          if (info.State.Running) {
            await container.stop();
          }
          await container.remove();
          const network = docker.getNetwork(`THUAI-RoomNet${room.id}`);
          await network.remove();
        } catch {
          return res
            .status(503)
            .send(
              "503 Service Unavailable: Failed to stop or remove docker container"
            );
        }
      }
    }

    const update = {
      ...{ status: req.body.status },
      updatedAt: new Date(),
      updatedBy: req.auth.id,
    };

    const newRoom = await Room.findOneAndUpdate({ id: req.params.id }, update);

    res.setHeader("Location", "/v1/rooms/" + newRoom!.id);
    res.status(204).end();
  } catch (err) {
    next(err);
  }
});

/**
 * DELETE an Room of id
 * @param {Number} id
 * @returns No Room or Not Found
 */
router.delete(
  "/:id",
  authenticate(["root", "organizer"]),
  async (req, res, next) => {
    try {
      const room = await Room.findOne({ id: req.params.id });

      if (!room) {
        return res.status(404).send("404 Not Found: Room does not exist");
      }

      if (process.env.NODE_ENV === "production") {
        try {
          const docker = new Docker();
          const container = docker.getContainer(`THUAI-Room${room.id}`);
          if (!container) {
            return res
              .status(404)
              .send("404 Not Found: Docker container does not exist");
          }
          const info = await container.inspect();
          if (info.State.Running) {
            await container.stop();
          }
          await container.remove();

          room.teams.map(async (teamId: number) => {
            const agent = docker.getContainer(`THUAI-Room${room.id}-${teamId}`);
            const info = await agent.inspect();
            if (info.State.Running) {
              await agent.stop();
            }
            await agent.remove();
          });

          const network = docker.getNetwork(`THUAI-RoomNet${room.id}`);
          await network.remove();
        } catch {
          return res
            .status(503)
            .send(
              "503 Service Unavailable: Failed to stop or remove docker container / network"
            );
        }
      }

      const deleteRoom = await Room.findOneAndDelete({
        id: req.params.id,
      });

      if (!deleteRoom) {
        return res.status(404).send("404 Not Found: Room does not exist");
      }

      res.status(204).end();
    } catch (err) {
      next(err);
    }
  }
);

export default router;
