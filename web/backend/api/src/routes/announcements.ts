import express from "express";
import authenticate from "../middlewares/authenticate";
import Announcement from "../models/announcement";
import pick from "lodash.pick";

const router = express.Router();

/**
 * GET announcements with queries
 * @param {number} contestId
 * @param {number} priority
 * @param {number} begin
 * @param {number} end
 * @returns {object[]} certain announcements
 */
router.get("/", async (req, res, next) => {
  const query = pick(req.query, ["contestId", "priority"]);

  const begin = parseInt(req.query.begin as string, 10) || 0;
  const end = parseInt(req.query.end as string, 10) || Number.MAX_SAFE_INTEGER;

  try {
    const announcements = await Announcement.find(query as any, "-_id -__v", {
      skip: begin,
      limit: end - begin + 1,
      sort: "-priority -updatedAt",
    });

    res.json(announcements);
  } catch (err) {
    next(err);
  }
});

/**
 * GET announcement of Id
 * @param {number} id - announcement Id
 * @returns {object} - announcement with id
 */
router.get("/:id", async (req, res, next) => {
  try {
    const announcement = await Announcement.findOne(
      { id: req.params.id },
      "-_id -__v"
    );

    if (!announcement) {
      return res.status(404).send("404 Not Found: Announcement does not exist");
    }

    res.json(announcement);
  } catch (err) {
    next(err);
  }
});

/**
 * POST new announcement
 * @returns Location header
 */
router.post(
  "/",
  authenticate(["root", "organizer"]),
  async (req, res, next) => {
    try {
      const announcement = await new Announcement({
        ...req.body,
        createdBy: req.auth.id,
        updatedBy: req.auth.id,
      }).save();

      res.setHeader("Location", "/v1/announcements/" + announcement.id);
      res.status(201).end();
    } catch (err) {
      next(err);
    }
  }
);

/**
 * PUT existing announcement
 * @param {number} id - updating announcement's Id
 * @returns Location header or Not Found
 */
router.put(
  "/:id",
  authenticate(["root", "organizer"]),
  async (req, res, next) => {
    const update = {
      ...req.body,
      updatedAt: new Date(),
      updatedBy: req.auth.id,
    };

    try {
      const newAnnouncement = await Announcement.findOneAndUpdate(
        { id: req.params.id },
        update
      );

      if (!newAnnouncement) {
        return res
          .status(404)
          .send("404 Not Found: Announcement does not exist");
      }

      res.setHeader("Location", "/v1/announcements/" + newAnnouncement.id);
      res.status(204).end();
    } catch (err) {
      next(err);
    }
  }
);

/**
 * DELETE an announcement of Id
 * @param {Number} id - deleting announcement's id
 * @returns No Content or Not Found
 */
router.delete(
  "/:id",
  authenticate(["root", "organizer"]),
  async (req, res, next) => {
    try {
      const deleteAnnouncement = await Announcement.findOneAndDelete({
        id: req.params.id,
      });

      if (!deleteAnnouncement) {
        return res
          .status(404)
          .send("404 Not Found: Announcement does not exist");
      }

      res.status(204).end();
    } catch (err) {
      next(err);
    }
  }
);

export default router;
