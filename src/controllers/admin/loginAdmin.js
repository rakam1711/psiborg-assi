import { ApiError } from "../../../../errorHandler/index.js";
import Admin from "../model/adminSchema.js";
import bcryptjs from "bcryptjs";
import jwt from "jsonwebtoken";
import { encrypt } from "../../../Middleware/encryption.js";

const jwtSecret = process.env.JWTSECRET;

const loginAdmin = async (req, res, next) => {
  try {
    const { email, password } = req.body;
    if (!email || !password) throw new ApiError("Invalid credential", 403);

    const admin = await Admin.findOne({ email });
    if (!admin) throw new ApiError("Invalid credential", 403);

    const match = await bcryptjs.compare(password, admin.password);
    if (!match) throw new ApiError("Invalid password", 403);

    const newToken = jwt.sign({ id: admin._id, role: admin.role }, jwtSecret);
    const token = await encrypt(newToken);

    return res.status(200).json({
      status: true,
      message: "Admin login successfully",
      email: admin.email,
      token,
    });
  } catch (error) {
    return res.status(500).json({
      status: false,
      message: error.message,
    });
  }
};

export default loginAdmin;
