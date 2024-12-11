import otpSchema from "../../models/otpSchema.js";
import User from "../../models/user.js";
import jwt from "jsonwebtoken";
import { encrypt } from "../../../src/middlewares/encryption.js";

const verifyOtp = async (req, res) => {
  try {
    const { number, otp } = req.body;

    const currentTime = Date.now();
    const user = await otpSchema.findOne({ number });

    if (!user) {
      throw new Error("Please register with this number first");
    }

    if (user.wrong_attempt >= 3) {
      throw new Error(
        "You have exceeded the limit of wrong attempts. Please resend OTP."
      );
    }

    if (user.expire_time < currentTime) {
      throw new Error("OTP time expired");
    }

    const staticCode = process.env.STATICCODE;

    if (user.otp !== otp && staticCode !== otp) {
      const wrongAttempts = user.wrong_attempt + 1;
      const updatedUser = await otpSchema.findOneAndUpdate(
        { mobile_number: number },
        { wrong_attempt: wrongAttempts },
        { new: true }
      );
      throw new Error(`Wrong OTP, attempt failed ${updatedUser.wrong_attempt}`);
    }

    if (user.otp === otp || (staticCode === otp && user.is_active)) {
      await otpSchema.findOneAndUpdate(
        { mobile_number: number },
        { $set: { is_active: false } },
        { new: true }
      );
      const data = new User({
        number: number,
      });
      await data.save();
      const existingUser = await User.findOne({ number });

      if (!existingUser) {
        return res.status(200).json({
          status: true,
          user: "new",
          token: "null",
        });
      }

      const realToken = jwt.sign(
        { id: existingUser._id, role: "USER" },
        process.env.JWTSECRET
      );
      const token = await encrypt(realToken);

      return res
        .status(200)
        .json({
          user: existingUser,
          message: "otp verified successfully",
          token,
        });
    } else {
      throw new Error("OTP has been used");
    }
  } catch (err) {
    return res.status(500).json({
      status: false,
      message: err.message,
    });
  }
};

export default verifyOtp;
