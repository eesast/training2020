import express from "express";
import authenticate from "../middlewares/authenticate";
import Contest from "../models/contest";
import pick from "lodash.pick";

import Team from "../models/team";

const router = express.Router();

/**
 * GET contests with queries
 * @param {string} type
 * @param {number} year
 * @returns {Object[]} certain contests
 */
router.get("/", async (req, res, next) => {
  const query = pick(req.query, ["type", "year"]);

  try {
    const contests = await Contest.find(query as any, "-_id -__v");
    res.json(contests);
  } catch (err) {
    next(err);
  }
});

/**
 * GET contest of id
 * @param {Number} id
 * @returns {Object} contest with id
 */
router.get("/:id", async (req, res, next) => {
  try {
    const contest = await Contest.findOne({ id: req.params.id }, "-_id -__v");

    if (!contest) {
      return res.status(404).send("404 Not Found: Contest does not exist");
    }

    const num = await Team.count({ contestId: parseInt(req.params.id, 10) });

    res.json({ ...contest.toObject(), totalTeams: num });
  } catch (err) {
    next(err);
  }
});

/**
 * POST new contest
 * @returns {String} Location header
 */
router.post(
  "/",
  authenticate(["root", "organizer"]),
  async (req, res, next) => {
    try {
      const contest = await new Contest({
        ...req.body,
        createdBy: req.auth.id,
        updatedBy: req.auth.id,
      }).save();

      res.setHeader("Location", "/v1/contests/" + contest.id);
      res.status(201).end();
    } catch (err) {
      next(err);
    }
  }
);

/**
 * PUT existing contest
 * @param {Number} id - updating contest's id
 * @returns {String} Location header or Not Found
 */
router.put(
  "/:id",
  authenticate(["root", "organizer"]),
  async (req, res, next) => {
    try {
      const contest = await Contest.findOne({ id: req.params.id });

      if (!contest) {
        return res.status(404).send("404 Not Found: Contest does not exist");
      }

      const update = {
        ...req.body,
        updatedAt: new Date(),
        updatedBy: req.auth.id,
      };

      const newContest = await Contest.findOneAndUpdate(
        { id: req.params.id },
        update
      );

      res.setHeader("Location", "/v1/contests/" + newContest!.id);
      res.status(204).end();
    } catch (err) {
      next(err);
    }
  }
);

/**
 * DELETE an contest of id
 * @param {Number} id
 * @returns No Contest or Not Found
 */
router.delete(
  "/:id",
  authenticate(["root", "organizer"]),
  async (req, res, next) => {
    try {
      const deleteContest = await Contest.findOneAndDelete({
        id: req.params.id,
      });

      if (!deleteContest) {
        return res.status(404).send("404 Not Found: Contest does not exist");
      }

      res.status(204).end();
    } catch (err) {
      next(err);
    }
  }
);

export default router;
