import mongoose from "mongoose";

const otpSchema = new mongoose.Schema(
  {
    number: {
      type: Number,
      required: true,
      unique: true,
      validate: {
        validator: function (v) {
          return /^[0-9]{10}$/.test(v);
        },
        message: "{VALUE} is not a valid mobile number!",
      },
    },
    otp: {
      type: Number,
    },
    expire_time: {
      type: String,
    },
    wrong_attempt: {
      type: Number,
      default: 0,
    },
    is_active: {
      type: Boolean,
      default: true,
    },
  },
  { timestamps: true }
);

export default mongoose.model("otp", otpSchema);
