import mongoose from "mongoose";
import Counter from "./counter";

export interface TrackModel extends mongoose.Document {
  id: number;
  name: string;
  year: number;
  players: [number];
  description: string;
  open: boolean;
  preOpen: boolean;
  prePlayers: [number];
}

const trackSchema = new mongoose.Schema<TrackModel>(
  {
    id: { type: Number, unique: true },
    name: { type: String },
    year: { type: Number },
    players: {
      type: [{ type: Number, index: true }],
      index: true,
      default: [],
    },
    description: { type: String, default: "No description" },
    open: { type: Boolean, default: false },
    preOpen: { type: Boolean, default: false },
    prePlayers: {
      type: [{ type: Number, index: true }],
      index: true,
      default: [],
    },
  },
  {
    collection: "tracks",
  }
);

trackSchema.pre<TrackModel>("save", function (next) {
  Counter.findByIdAndUpdate(
    "track",
    { $inc: { count: 1 } },
    { new: true, upsert: true },
    (err, counter: any) => {
      if (err) {
        return next(err);
      }
      this.id = counter.count;
      next();
    }
  );
});

export default mongoose.model<TrackModel>("Track", trackSchema);
