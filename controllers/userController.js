const asyncHandler = require("express-async-handler");
const bcrypt = require("bcryptjs");
const { validationResult } = require("express-validator");
const crypto = require("crypto");
const nodemailer = require("nodemailer");
const accountMail = require("../utils/sendOtp");
const User = require("../Model/UserModel");
const genrateToken = require("../jwt/jwt");
const { generateOtp } = require("../utils/generateOtp");
const VerificationOtp = require("../Model/OtpModel");

const registerUser = asyncHandler(async (req, res) => {
  console.log("register controller called");

  console.log(req.body);
  const errors = validationResult(req);

  if (!errors.isEmpty()) {
    return res.status(400).json({ errors: errors.array() });
  }

  const { username, email, password, phnumber } = req.body;

  const existEmail = await User.findOne({ email });

  if (existEmail) {
    return res.status(400).json({ message: "Email already exists" });
  }

  const salt = await bcrypt.genSalt(10);
  const hashedPassword = await bcrypt.hash(password, salt);

  const result = await User.create({
    username,
    email,
    password: hashedPassword,
    phnumber,
  });

  const token = genrateToken(result.id);

  result.token = token;
  await result.save();

  if (result) {
    res.status(201).json({
      message: "User registered successfully",
      _id: result._id,
      email: result.email,
      username: result.username,
      phnumber: result.phnumber,
    });
  } else {
    res.status(400).json({ message: "Invalid user data" });
  }
});

const loginUser = asyncHandler(async (req, res) => {
  console.log("login controller called");
  const { email, password } = req.body;

  if (!email || !password) {
    res.status(400);
    throw new Error("Please provide both email and password");
  }

  const user = await User.findOne({ email });

  if (!user) {
    res.status(400);
    throw new Error("Invalid email or password");
  }

  const isPasswordValid = await bcrypt.compare(password, user.password);

  if (!isPasswordValid) {
    res.status(400);
    throw new Error("Invalid email or password");
  }

  const token = genrateToken(user._id);
  user.token = token;
  await user.save();

  res.status(200).json({
    message: "User logged in successfully",
    _id: user.id,
    email: user.email,
    userName: user.userName,
    token: token,
  });
});

const forgotPassword = asyncHandler(async (req, res) => {
  try {
    const user = await User.findOne({ email: req.body.email.toLowerCase() });
    if (!user) {
      return res.status(401).json("Email Not Found");
    }

    await VerificationOtp.deleteMany({ userId: user._id });
    const otp = generateOtp();
    await VerificationOtp.create({
      userId: user.id,
      otp,
    });
    await accountMail(user.email, "Reset Password OTP", otp);
    res.status(200).json("Reset Email Sent");
  } catch (error) {
    res.status(500).json(error);
  }
});

const verifyOtp = asyncHandler(async (req, res) => {
  const { otp } = req.body;

  try {
    const otpVerified = await VerificationOtp.findOne({ otp });

    if (!otpVerified) {
      return res.status(404).json({ code: 404, message: "Invalid OTP" });
    }

    res.status(200).json({
      code: 200,
      data: otpVerified,
      message: "Otp Verified Successfully",
    });
  } catch (error) {
    res.status(500).json({ code: 500, error: "Server Error" });
  }
});

const ResetPassword = asyncHandler(async (req, res) => {
  console.log(req.body);

  const { otp, password } = req.body;

  const otpVerified = await VerificationOtp.findOne({ otp });

  if (!otpVerified) {
    return res.status(404).json({ code: 404, message: "Invalid OTP" });
  }

  console.log(otpVerified, "Verified Otp");

  const salt = await bcrypt.genSalt(10);
  const hashedPassword = await bcrypt.hash(password, salt);

  console.log(hashedPassword, "Hashed Password");

  try {
    await User.findByIdAndUpdate(otpVerified.userId, {
      $set: {
        password: hashedPassword,
      },
    });
    await VerificationOtp.deleteMany({ userId: otpVerified.userId });
    return res
      .status(200)
      .json({ code: 200, message: "Password Updated successfully" });
  } catch (error) {
    console.log(error);
    res.status(500).json({ code: 500, error: "Error While Reset Password" });
  }
});

module.exports = {
  registerUser,
  loginUser,
  forgotPassword,
  verifyOtp,
  ResetPassword,
};
