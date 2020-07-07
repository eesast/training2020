import mongoose from "mongoose";

export interface CounterModel extends mongoose.Document {
  _id: string;
  count: number;
}

/**
 * Used for auto-increment id
 */
const counterSchema = new mongoose.Schema<CounterModel>(
  {
    _id: { type: String, required: true },
    count: { type: Number, default: 0 },
  },
  {
    collection: "counters",
  }
);

export default mongoose.model<CounterModel>("Counter", counterSchema);
