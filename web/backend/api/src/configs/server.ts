/**
 * Server related config
 */

import path from "path";

const staticPath = path.resolve(__dirname, "../../public");

export default {
  port: "28888",
  staticFilePath:
    process.env.NODE_ENV === "production" ? "/home/node/public" : staticPath,
};
