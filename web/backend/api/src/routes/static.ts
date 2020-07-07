import express from "express";
import fs from "fs";
import multer from "multer";
import path from "path";
import { v1 as uuid } from "uuid";
import serverConfig from "../configs/server";
import authenticate from "../middlewares/authenticate";
import isImage from "is-image";
import cwebp from "cwebp-bin";
import utf8 from "utf8";
import { execFile } from "child_process";

const router = express.Router();
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    const dir = path.resolve(serverConfig.staticFilePath, req.params.category!);
    fs.mkdir(dir, { recursive: true }, (err) => cb(err, dir));
  },
  filename: (req, file, cb) => {
    const dotIndex = file.originalname.lastIndexOf(".");
    const extention = file.originalname.substring(dotIndex);
    const fullPath = path.join(
      serverConfig.staticFilePath,
      req.params.category!,
      file.originalname
    );
    const name = file.originalname.substring(0, dotIndex);
    const newFilename =
      name + (fs.existsSync(fullPath) ? "_" + uuid() : "") + extention;

    req.file = {
      ...req.file,
      filename: newFilename,
    };
    cb(null, newFilename);
  },
});
const upload = multer({ storage });

/**
 * GET
 * Get static files
 * Use `express.static()` in `app.js`
 */

/**
 * GET
 * Get static images
 */
router.get("/images/:filename", async (req, res) => {
  const filename = req.params.filename;
  const fullPath = path.resolve(
    serverConfig.staticFilePath,
    "images",
    filename
  );

  fs.exists(fullPath, (exists) => {
    if (!exists) {
      return res.status(404).send("404 Not Found: File does not exist");
    }

    if (req.accepts("image/webp")) {
      fs.exists(fullPath + ".webp", (webpExists) => {
        if (webpExists) {
          res.sendFile(fullPath + ".webp");
        } else {
          res.sendFile(fullPath);
        }
      });
    } else {
      res.sendFile(fullPath);
    }
  });
});

/**
 * GET
 * Get static thuai playback
 */
router.get("/thuai/:filename", async (req, res) => {
  const filename = req.params.filename;
  const fullPath = path.resolve("/data/thuai/playback", filename);

  fs.exists(fullPath, (exists) => {
    if (!exists) {
      return res.status(404).send("404 Not Found: File does not exist");
    }

    res.sendFile(fullPath);
  });
});

/**
 * POST new files
 * @param {string} category directory
 * @returns Location header
 */
router.post(
  "/:category",
  authenticate([]),
  upload.single("file"),
  async (req, res) => {
    const category = req.params.category;
    const filename = req.file.filename;
    const fullPath = path.resolve(
      serverConfig.staticFilePath,
      category,
      filename
    );

    if (isImage(filename)) {
      try {
        await execFile(cwebp, [fullPath, "-o", fullPath + ".webp"]);
      } catch (err) {
        console.error(err);
      }
    }

    res.setHeader(
      "Location",
      `/static/${category}/` + escape(utf8.encode(filename))
    );
    res
      .status(201)
      .send(`/static/${category}/` + escape(utf8.encode(filename)));
  }
);

/**
 * DELETE file
 * @param {string} category - local directory
 * @param {string} filename
 * @returns No Content or Not Found
 */
router.delete(
  "/:category/:filename",
  authenticate([
    "root",
    "writer",
    "editor",
    "keeper",
    "organizer",
    "counselor",
  ]),
  upload.single("file"),
  async (req, res, next) => {
    const category = req.params.category;
    const filename = req.params.filename;
    const fullPath = path.join(serverConfig.staticFilePath, category, filename);

    if (!fs.existsSync(fullPath)) {
      return res.status(404).send("404 Not Found: File does not exist");
    }

    return fs.unlink(fullPath, (err) => {
      if (err) {
        next(err);
      } else {
        res.status(204).end();
      }
    });
  }
);

export default router;
