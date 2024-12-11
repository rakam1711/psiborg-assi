import Admin from "../models/adminSchema.js";
import bcryptjs from "bcryptjs";

async function scripts() {
  await createFirstAdmin();
}

export default scripts;

async function createFirstAdmin() {
  try {
    const result = await Admin.findOne();
    if (result) return;
    const salt = bcryptjs.genSaltSync(2);
    const hashedPassword = await bcryptjs.hash("1212", salt);

    const admin = new Admin({
      number: "9478180168",
      email: "admin@gmail.com",
      name: "Admin",
      role: "ADMIN",
      password: hashedPassword,
    });
    await admin.save();
    console.log("New admin is created");
  } catch (err) {
    console.log(err.message);
  }
}
