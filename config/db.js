const mongoose = require("mongoose");

const dbConnect = async () => {
  try {
    const con = await mongoose.connect(process.env.MONGO_ENV);

    console.log("connected db");
  } catch (error) {
    console.log(error);
  }
};

module.exports = dbConnect;
