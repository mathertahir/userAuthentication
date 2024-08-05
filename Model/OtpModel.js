const mongoose = require("mongoose");

const VerificationOtpSchema = new mongoose.Schema(
  {
    userId: {
      type: String,
      ref: "User",
      required: true,
    },
    otp: { type: String, required: true },
  },
  {
    timestamps: true,
  }
);
module.exports = mongoose.model("VerificationOtp", VerificationOtpSchema);
