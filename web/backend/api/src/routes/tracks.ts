import express from "express";
import authenticate from "../middlewares/authenticate";
import Track from "../models/track";
import pick from "lodash.pick";

const router = express.Router();

/**
 * GET tracks with queries
 * @param {string} name name of the track
 * @param {number} year year of the track
 * @param {boolean} open track open to join
 * @param {number} playerId track one have joined
 * @param {number} prePlayerId track preContest one have joined
 * @returns {Object[]} certain tracks without players and prePlayers
 */
router.get("/", authenticate([]), async (req, res, next) => {
  const query: any = pick(req.query, [
    "name",
    "year",
    "open",
    "playerId",
    "preOpen",
    "prePlayerId",
  ]);
  if (query.open) query.open = query.open == "true";
  if (query.open) query.preOpen = query.preOpen == "true";
  if (query.year) query.year = parseFloat(query.year);
  if (query.playerId) query.players = parseFloat(query.playerId);
  if (query.prePlayerId) query.prePlayers = parseFloat(query.prePlayerId);
  delete query.playerId;
  delete query.prePlayerId;

  try {
    const tracks = await Track.find(query, "-_id -__v -players -prePlayers");
    res.json(tracks);
  } catch (e) {
    next(e);
  }
});

/**
 * POST new track
 * @param {string} name name of the track
 * @param {number} year year of the track default this year
 * @param {number} description description of the track default "No Desciptions"
 * @returns Location header
 */
router.post("/", authenticate(["root", "admin"]), async (req, res, next) => {
  const { name, year, description, open, preOpen } = pick(req.body, [
    "name",
    "year",
    "description",
    "open",
    "preOpen",
  ]);
  try {
    const newTrack = new Track({
      name,
      year,
      description,
      open,
      preOpen,
      players: [],
      prePlayers: [],
    });
    const result = await newTrack.save();
    res.setHeader("Location", `/v1/tracks/${result.id}`);
    res.status(201).end();
  } catch (err) {
    next(err);
  }
});

/**
 * PUT existing track
 * @param {number} id id of the track
 * @param {string} name body:newname of the track
 * @param {number} year body:year of the track default this year
 * @param {number} description body:description of the track default "No Desciptions"
 * @param {boolean} open body:is open to join
 * @param {boolean} preOpen body:is open to join pre contest
 * @returns status code
 */
router.put("/:id", authenticate(["root", "admin"]), async (req, res, next) => {
  const id = req.params.id;
  const query = pick(req.body, [
    "name",
    "year",
    "description",
    "open",
    "preOpen",
  ]);
  try {
    await Track.updateOne({ id }, { $set: query });
    res.status(204).end();
  } catch (err) {
    next(err);
  }
});

/**
 * POST join a track
 * @param {number} id track to join
 * @param {number} playerId user to join
 * @returns status
 */
router.post(
  "/:id/players",
  authenticate(["root", "admin", "self"]),
  async (req, res, next) => {
    const playerId = req.body.playerId;
    const trackId = req.params.id;
    if (req.auth.selfCheckRequired) {
      if (parseFloat(playerId) !== req.auth.id) {
        return res.status(401).send("401 Unauthorized: Permission denied");
      }
    }
    try {
      const track = await Track.findOne({ id: trackId });
      if (!track)
        return res.status(404).send("404 Not Found: Track not found.");
      if (!track.open && req.auth.selfCheckRequired)
        return res.status(403).send("403 Forbidden: Track not opened.");

      if (
        track.prePlayers.indexOf(playerId) == -1 &&
        req.auth.selfCheckRequired
      )
        return res
          .status(403)
          .send(
            "403 Forbidden: You cannot join a track without joining its pre contest"
          );

      const old = await Track.findOne({
        players: playerId,
        year: track.year,
      });
      if (old)
        return res
          .status(409)
          .send("409 Conflict: You should not join multiple tracks.");

      await Track.findOneAndUpdate(
        { id: trackId, players: { $ne: playerId } },
        { $push: { players: playerId } }
      );
      return res.status(204).end();
    } catch (err) {
      next(err);
    }
  }
);

/**
 * POST join a track's pre-contest
 * @param {number} id track to join
 * @param {number} playerId user to join
 * @returns status
 */
router.post(
  "/:id/prePlayers",
  authenticate(["root", "admin", "self"]),
  async (req, res, next) => {
    const playerId = req.body.playerId;
    const trackId = req.params.id;
    if (req.auth.selfCheckRequired) {
      if (parseFloat(playerId) !== req.auth.id) {
        return res.status(401).send("401 Unauthorized: Permission denied");
      }
    }
    try {
      const track = await Track.findOne({ id: trackId });
      if (!track)
        return res.status(404).send("404 Not Found: Track not found.");
      if (!track.preOpen && req.auth.selfCheckRequired)
        return res.status(403).send("403 Forbidden: Track not pre-opened.");

      await Track.findOneAndUpdate(
        { id: trackId, players: { $ne: playerId } },
        { $push: { prePlayers: playerId } }
      );
      return res.status(204).end();
    } catch (err) {
      next(err);
    }
  }
);

/**
 * Check whether a players joins a track
 * @param {number} id trackId
 * @param {number} playerId
 * @returns status
 */
router.get("/:id/players/:playerId", authenticate([]), async (req, res) => {
  const playerId = parseInt(req.params.playerId, 10);
  const trackId = parseInt(req.params.id, 10);
  const track = await Track.findOne({ id: trackId, players: playerId });
  if (track) return res.status(200).end();
  return res
    .status(404)
    .send("404 Not Found: Track not found or player is not in");
});

/**
 * Check whether a players joins a track's Pre-contest
 * @param {number} id trackId
 * @param {number} playerId
 * @returns status
 */
router.get("/:id/prePlayers/:playerId", authenticate([]), async (req, res) => {
  const playerId = parseInt(req.params.playerId, 10);
  const trackId = parseInt(req.params.id, 10);
  const track = await Track.findOne({ id: trackId, prePlayers: playerId });
  if (track) return res.status(200).end();
  return res
    .status(404)
    .send("404 Not Found: Track not found or player is not in its pre-contest");
});

/**
 * DELETE leave a track
 * @param {number} id track to leave
 * @param {number} playerId user to leave
 * @returns status
 */
router.delete(
  "/:id/players/:playerId",
  authenticate(["root", "admin", "self"]),
  async (req, res, next) => {
    const playerId = parseInt(req.params.playerId, 10);
    const trackId = parseInt(req.params.id, 10);
    if (req.auth.selfCheckRequired) {
      if (playerId !== req.auth.id) {
        return res.status(401).send("401 Unauthorized: Permission denied");
      }
    }
    try {
      const playersQuery = { players: playerId };
      const track = await Track.findOne({ id: trackId, ...playersQuery });
      if (!track)
        return res.status(404).send("404 Not Found: Track not existed");

      if (!track.open && req.auth.selfCheckRequired)
        return res.status(403).send("403 Forbidden: Track not opened.");

      await Track.findOneAndUpdate({ id: trackId }, { $pull: playersQuery });
      return res.status(204).end();
    } catch (err) {
      next(err);
    }
  }
);

/**
 * DELETE leave a track's pretest
 * @param {number} id track to leave
 * @param {number} playerId user to leave
 * @returns status
 */
router.delete(
  "/:id/prePlayers/:playerId",
  authenticate(["root", "admin", "self"]),
  async (req, res, next) => {
    const playerId = parseInt(req.params.playerId, 10);
    const trackId = parseInt(req.params.id, 10);
    if (req.auth.selfCheckRequired) {
      if (playerId !== req.auth.id) {
        return res.status(401).send("401 Unauthorized: Permission denied");
      }
    }
    try {
      const playersQuery = { prePlayers: playerId };
      const track = await Track.findOne({ id: trackId, ...playersQuery });
      if (!track)
        return res.status(404).send("404 Not Found: Track not existed");

      if (!track.preOpen && req.auth.selfCheckRequired)
        return res.status(403).send("403 Forbidden: Track not opened.");

      await Track.findOneAndUpdate({ id: trackId }, { $pull: playersQuery });
      return res.status(204).end();
    } catch (err) {
      next(err);
    }
  }
);

/**
 * GET track of id
 * @param {number} id
 * @param {boolean} playerInfo
 * @param {boolean} prePlayerInfo
 * @returns {Object} track
 */
router.get("/:id", authenticate([]), async (req, res, next) => {
  const id = req.params.id;
  const playerInfo = req.query.playerInfo || false;
  const prePlayerInfo = req.query.prePlayerInfo || false;
  try {
    let query = "-_id -__v";
    if (!playerInfo) query += " -players";
    if (!prePlayerInfo) query += " -prePlayers";
    const result = await Track.findOne({ id }, query);
    if (!result) return res.status(404).send("404 Not Found: Track not found.");
    return res.json(result);
  } catch (e) {
    next(e);
  }
});

/**
 * DELETE track
 * @param {string} id ID of the track
 * @returns No Track or Not Found
 */
router.delete(
  "/:id",
  authenticate(["root", "admin"]),
  async (req, res, next) => {
    try {
      const deleteTrack = await Track.findOneAndDelete({
        id: req.params.id,
      });

      if (!deleteTrack) {
        return res.status(404).send("404 Not Found: Track does not exist");
      }
      res.status(204).end();
    } catch (err) {
      next(err);
    }
  }
);

export default router;
