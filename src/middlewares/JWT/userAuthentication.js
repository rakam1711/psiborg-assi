import crypto from "crypto";
import jwt from "jsonwebtoken";
import { ApiError } from "../../../errorHandler/index.js";
import User from "../../models/user.js";

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

const authenticateUser = async (req, res, next) => {
  try {
    const authHeader = req.headers["authorization"];
    if (!authHeader) {
      return new ApiError(
        "Not authenticated.",
        401,
        "middleware=>JWT=>userAuthentication"
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
        "middleware=>JWT=>userAuthentication"
      );
    }
    if (!decodedToken) {
      return new ApiError(
        "Not authenticated.",
        401,
        "middleware=>JWT=>userAuthentication"
      );
    }

    if (decodedToken.role === "USER") {
      const user = await User.findById(decodedToken?.id);
      if (!user) {
        return res
          .json({ success: false, message: "User does not exist" })
          .status(404);
      }
      req.userId = decodedToken.id;
      req.role = "USER";
    }

    return next();
  } catch (err) {
    console.log(err.message, "src/Middleware/JWT/userAuthentication");
  }
};

export default authenticateUser;
