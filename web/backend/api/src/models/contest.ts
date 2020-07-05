import mongoose from "mongoose";
import Counter from "./counter";

export interface ContestModel extends mongoose.Document {
  id: number;
  type: string;
  name: string;
  year: number;
  enrollAvailable: boolean;
  preOpen?: boolean;
  track?: number;
  createdAt: Date;
  createdBy: number;
  updatedAt: Date;
  updatedBy: number;
}

const contestSchema = new mongoose.Schema<ContestModel>(
  {
    id: { type: Number, unique: true },
    type: { type: String, required: true }, // ["电设", "队式", "软设"]
    name: { type: String, required: true }, // 清华大学电子工程系第一届软件设计大赛
    year: { type: Number, required: true },
    enrollAvailable: { type: Boolean, default: true },
    preOpen: { type: Boolean },
    track: { type: Number },
    createdAt: { type: Date, default: Date.now },
    createdBy: Number,
    updatedAt: { type: Date, default: Date.now },
    updatedBy: Number,
  },
  {
    collection: "contests",
  }
);

contestSchema.pre<ContestModel>("save", function (next) {
  Counter.findByIdAndUpdate(
    "contest",
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

export default mongoose.model<ContestModel>("Contest", contestSchema);
