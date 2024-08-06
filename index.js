const express = require("express");
const dotenv = require("dotenv").config();
const dbConnection = require("./config/db");

const app = express();

dbConnection();

app.use(express.json());
app.use(express.urlencoded({ extended: true }));

app.use("/api/user", require("./routes/userRoutes"));

const port = process.env.PORT || 5000;

app.get("/", (req, res) => {
  res.send("Hey this is my API running 🥳");
});

app.listen(port, () => {
  console.log(`Server is running on port ${port}`);
});
