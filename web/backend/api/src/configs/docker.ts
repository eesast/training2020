/**
 * THUAI docker
 */

const image = (process.env.NODE_ENV === "production"
  ? process.env.IMAGE_NAME
  : "test") as string;

const server = (process.env.NODE_ENV === "production"
  ? process.env.THUAI_SERVER
  : "THUAI") as string;

export { image, server };
