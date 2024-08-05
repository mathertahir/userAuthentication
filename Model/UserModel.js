const mongoose = require("mongoose");

const userSchema = mongoose.Schema(
  {
    _id: {
      type: String,
      default: () => new mongoose.Types.ObjectId().toString(),
    },
    username: {
      type: String,
      required: [true, "Please enter the name"],
    },
    email: {
      type: String,
      required: [true, "Please enter the email"],
      unique: true,
    },
    password: {
      type: String,
      required: [true, "Please enter the Password"],
    },
    phnumber: {
      type: String,
      required: [true, "Please Enter the Phone Number"],
    },

    token: {
      type: String,
    },
  },
  {
    timestamps: true,
  }
);

module.exports = mongoose.model("User", userSchema);
