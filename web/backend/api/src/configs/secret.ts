/**
 * Used for jwt signing
 */

export default (process.env.NODE_ENV === "production"
  ? process.env.SECRET
  : "sast-api") as string;
