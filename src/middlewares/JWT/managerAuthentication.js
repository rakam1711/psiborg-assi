import crypto from "crypto";
import jwt from "jsonwebtoken";
import { ApiError } from "../../../errorHandler/index.js";

import managerModel from "../../models/managerSchema.js";
const { JWTSECRET, SECRETKEY, IV } = process.env;

const decrypt = async (encryptedToken) => {
  const decipher = crypto.createDecipheriv(
    "aes-256-cbc",
    Buffer.from(SECRETKEY, "hex"),
    Buffer.from(IV, "hex")
  );
  let decrypted = decipher.update(encryptedToken, "hex", "utf-8");
  decrypted += decipher.final("utf-8");
  return decrypted;
};

const authenticateManager = async (req, res, next) => {
  try {
    const authHeader = req.headers["authorization"];
    if (!authHeader) {
      return new ApiError(
        "Not authenticated.",
        401,
        "middleware=>JWT=>managerAuthentication"
      );
    }
    const encryptedToken = authHeader.split(" ")[1];
    const token = await decrypt(encryptedToken);
    let decodedToken;
    try {
      decodedToken = jwt.verify(token, JWTSECRET);
    } catch (err) {
      return new ApiError(
        "Please Login First.",
        401,
        "middleware=>JWT=>managerAuthentication"
      );
    }
    if (!decodedToken) {
      return new ApiError(
        "Not authenticated.",
        401,
        "middleware=>JWT=>managerAuthentication"
      );
    }

    if (decodedToken.role === "MANAGER") {
      const manager = await managerModel.findById(decodedToken?.id);
      if (!manager) {
        return res
          .json({ success: false, message: "Manager does not exist" })
          .status(404);
      }
      req.managerId = decodedToken.id;
      req.role = "MANAGER";
      req.manager = manager;
    }

    return next();
  } catch (err) {
    console.log(err.message, "src/Middleware/JWT/managerAuthentication");
  }
};

export default authenticateManager;
