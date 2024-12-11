import mongoose from "mongoose";

const admin = new mongoose.Schema(
  {
    number: { type: String, trim: true, required: true, unique: true },
    email: { type: String, trim: true, required: true, unique: true },
    role: { type: String, enum: ["ADMIN", "SUBADMIN"] },
    name: { type: String, trim: true, default: "" },
    password: { type: String, required: true },
    profile_image: { type: String, default: null },
    status: { type: Boolean, default: false },
  },
  {
    timestamps: true,
    collection: "admins",
  }
);

const Admin = mongoose.model("Admin", admin);
export default Admin;
