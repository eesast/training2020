import express from "express";
import authenticate from "../middlewares/authenticate";
import Comment from "../models/comment";
import pick from "lodash.pick";

const router = express.Router();

/**
 * GET comments with queries
 * @param {number} replyTo
 * @param {number} likedBy
 * @param {number} articleId
 * @param {number} authorId
 * @returns {Object[]} certain articles
 */
router.get("/", async (req, res, next) => {
  const query = {
    ...pick(req.query, ["replyTo", "articleId", "authorId", "likedBy"]),
    ...(req.query.title && {
      title: { $regex: req.query.title, $options: "i" },
    }),
    visible: !req.query.invisible,
  };

  try {
    const comments = await Comment.find(query as any, "-_id -__v");
    res.json(comments);
  } catch (err) {
    next(err);
  }
});

/**
 * GET a comment of Id
 * @param {number} id
 * @returns {Object} comment with id
 */
router.get("/:id", async (req, res, next) => {
  try {
    const comment = await Comment.findOne({ id: req.params.id }, "-_id -__v");

    if (!comment) {
      return res.status(404).send("404 Not Found: Comment does not exist");
    }

    res.json(comment);
  } catch (err) {
    next(err);
  }
});

/**
 * Set likers of the comment of Id
 * @param {number} id
 * @returns No Content or Not Found
 */
router.get("/:id/like", authenticate([]), async (req, res, next) => {
  try {
    const comment = await Comment.findOneAndUpdate(
      { id: req.params.id },
      { $addToSet: { likers: req.auth.id } }
    );

    if (!comment) {
      return res.status(404).send("404 Not Found: Comment does not exist");
    }

    res.status(204).end();
  } catch (err) {
    next(err);
  }
});

/**
 * Remove likers from the comment of Id
 * @param {number} id
 * @returns No Content or Not Found
 */
router.get("/:id/unlike", authenticate([]), async (req, res, next) => {
  try {
    const comment = await Comment.findOneAndUpdate(
      { id: req.params.id },
      { $pullAll: { likers: [req.auth.id!] } }
    );

    if (!comment) {
      return res.status(404).send("404 Not Found: Comment does not exist");
    }

    res.status(204).end();
  } catch (err) {
    next(err);
  }
});

/**
 * POST new comment
 * @returns Location header
 */
router.post(
  "/",
  authenticate(["root", "writer", "reader", "editor"]),
  async (req, res, next) => {
    try {
      const comment = await new Comment({
        ...req.body,
        createdBy: req.auth.id,
        updatedBy: req.auth.id,
      }).save();

      res.setHeader("Location", "/v1/comments/" + comment.id);
      res.status(201).end();
    } catch (err) {
      next(err);
    }
  }
);

/**
 * PUT existing comment
 * @param {number} id - updating comment's id
 * @returns Location header or Not Found
 */
router.put(
  "/:id",
  authenticate(["root", "self", "editor"]),
  async (req, res, next) => {
    try {
      const comment = await Comment.findOne({ id: req.params.id });

      if (!comment) {
        return res.status(404).send("404 Not Found: Comment does not exist");
      }

      if (req.auth.selfCheckRequired) {
        if (comment.authorId !== req.auth.id) {
          return res.status(401).send("401 Unauthorized: Permission denied");
        }
      }

      const update = {
        ...req.body,
        updatedAt: new Date(),
        updatedBy: req.auth.id,
      };

      const newComment = await Comment.findOneAndUpdate(
        { id: req.params.id },
        update
      );

      res.setHeader("Location", "/v1/articles/" + newComment!.id);
      res.status(204).end();
    } catch (err) {
      next(err);
    }
  }
);

/**
 * DELETE a comment of Id
 * @param {number} id - deleting comment's id
 * @returns No Content or Not Found
 */
router.delete(
  "/:id",
  authenticate(["root", "self", "editor"]),
  async (req, res, next) => {
    try {
      const deleteComment = await Comment.findOneAndDelete({
        id: req.params.id,
      });

      if (!deleteComment) {
        return res.status(404).send("404 Not Found: Comment does not exist");
      }

      res.status(204).end();
    } catch (err) {
      next(err);
    }
  }
);

export default router;
