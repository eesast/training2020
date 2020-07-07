import mongoose from "mongoose";

export interface UserModel extends mongoose.Document {
  id: number;
  username: string;
  password: string;
  name: string;
  department: string;
  group: string;
  role: string;
  class?: string;
  email?: string;
  phone?: number;
  createdAt: Date;
  createdBy: number;
  updatedAt: Date;
  updatedBy: number;
}

export interface UserPublicToken {
  id: number;
  allowedEndpoints: { path: string; methods: string[] }[];
}

const userSchema = new mongoose.Schema<UserModel>(
  {
    id: { type: Number, required: true, unique: true },
    username: { type: String, unique: true },
    password: { type: String, required: true },
    name: { type: String, required: true },
    department: { type: String, required: true },
    group: { type: String, required: true },
    role: { type: String, required: true },
    class: String,
    email: { type: String, unique: true },
    phone: Number,
    createdAt: { type: Date, default: Date.now },
    createdBy: Number,
    updatedAt: { type: Date, default: Date.now },
    updatedBy: Number,
  },
  {
    collection: "users",
  }
);

export default mongoose.model<UserModel>("User", userSchema);
