import getOTP from "../../middlewares/OTP/otp.js";
import OTP from "../../../src/middlewares/OTP/sendOTP.js";
import otpSchema from "../../models/otpSchema.js";

const loginUser = async (req, res) => {
  try {
    const { countryCode, number } = req.body;
    const otp = await getOTP();
    const expireTime = new Date(Date.now() + 60000 * 2).getTime();

    const user = await otpSchema.findOne({ number });

    if (!user) {
      const newUser = new otpSchema({
        number,
        otp,
        expire_time: expireTime,
      });
      await newUser.save();
    } else {
      await otpSchema.findOneAndUpdate(
        { _id: user._id, number },
        {
          $set: {
            otp,
            expire_time: expireTime,
            wrong_attempt: 0,
            is_active: true,
          },
        },
        { new: true }
      );
    }

    await OTP(number, otp);

    return res.status(200).json({
      status: true,
      message: "OTP sent successfully",
    });
  } catch (err) {
    return res.status(500).json({
      status: false,
      message: err.message,
    });
  }
};

export default loginUser;
