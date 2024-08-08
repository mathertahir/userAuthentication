// const mongoose = require("mongoose");

// const dbConnect = async () => {
//   try {
//     const con = await mongoose.connect(process.env.MONGO_ENV);

//     console.log("connected db");
//   } catch (error) {
//     console.log(error);
//   }
// };

// module.exports = dbConnect;

const mongoose = require("mongoose");

const dbConnect = async () => {
  try {
    const con = await mongoose.connect(process.env.MONGO_ENV, {
      useNewUrlParser: true,
      useUnifiedTopology: true,
      serverSelectionTimeoutMS: 5000, // Adjusts how long to wait for a connection to be established
      socketTimeoutMS: 45000, // Adjusts how long Mongoose should wait before timing out
      autoReconnect: true, // Reconnect on connection loss
    });

    console.log(`Connected to MongoDB: ${con.connection.host}`);
  } catch (error) {
    console.error(`Error connecting to MongoDB: ${error.message}`);
    process.exit(1); // Optional: Exit the process if connection fails
  }
};

module.exports = dbConnect;
