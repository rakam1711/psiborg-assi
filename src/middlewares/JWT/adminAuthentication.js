import crypto from "crypto";
import jwt from "jsonwebtoken";
import { ApiError } from "../../../errorHandler/index.js";
import Admin from "../../models/adminSchema.js";

const JWTSECRET = process.env.JWTSECRET;
const secretKey = process.env.SECRETKEY;
const iv = process.env.IV;

const decrypt = async (encryptedToken) => {
  const decipher = crypto.createDecipheriv(
    "aes-256-cbc",
    Buffer.from(secretKey, "hex"),
    Buffer.from(iv, "hex")
  );
  let decrypted = decipher.update(encryptedToken, "hex", "utf-8");
  decrypted += decipher.final("utf-8");
  return decrypted;
};

const authenticateAdmin = async (req, res, next) => {
  try {
    const authHeader = req.headers["authorization"];
    if (!authHeader) {
      throw new ApiError(
        "Not authenticated.",
        401,
        "middleware=>JWT=>adminAuthentication"
      );
    }

    const encryptedToken = authHeader.split(" ")[1];
    const token = await decrypt(encryptedToken);
    let decodedToken;

    try {
      decodedToken = jwt.verify(token, JWTSECRET);
    } catch (err) {
      throw new ApiError(
        "Please Login First.",
        401,
        "middleware=>JWT=>adminAuthentication"
      );
    }

    if (!decodedToken) {
      throw new ApiError(
        "Not authenticated.",
        401,
        "middleware=>JWT=>adminAuthentication"
      );
    }

    if (decodedToken.role === "ADMIN" || decodedToken.role === "SUBADMIN") {
      const admin = await Admin.findById(decodedToken.id);
      if (!admin) {
        return res
          .status(404)
          .json({ success: false, message: "Admin does not exist" });
      }
      req.adminId = decodedToken.id;
      req.role = decodedToken.role;
    }

    next();
  } catch (err) {
    console.error(err.message, "src/Middleware/JWT/adminAuthentication");
    res.status(500).json({ success: false, message: err.message });
  }
};

export default authenticateAdmin;
