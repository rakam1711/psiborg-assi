import User from "../../models/user.js";
import jwt from "jsonwebtoken";
import { encrypt } from "../../../src/middlewares/encryption.js";

const register = async (req, res) => {
  try {
    const { fullName, number, email } = req.body;

    const mustData = { fullName, number, email };

    for (const key in mustData) {
      if (!mustData[key]) {
        throw new Error(`Invalid field: ${key}`);
      }
    }

    const user = await User.findOne({ number });
    user.name = fullName;
    user.email = email;

    await user.save();

    const tokenPayload = { id: user._id, role: "USER" };
    const tokenRaw = jwt.sign(tokenPayload, process.env.JWTSECRET);
    const token = await encrypt(tokenRaw);

    return res.status(201).json({
      status: true,
      message: "Created Successfully",
      token,
    });
  } catch (err) {
    return res.status(500).json({
      status: false,
      message: err.message,
    });
  }
};

export default register;
