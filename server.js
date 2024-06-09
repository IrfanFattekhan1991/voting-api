const userRoutes = require("./routes/userRoutes");
const mongoose = require("mongoose");
const express = require("express");
const app = express();

mongoose
  .connect("mongodb://localhost:27017/voting-app")
  .then(() => console.log("Connected to MongoDB....."))
  .catch((err) => console.Console.log("Error occured...", err));

app.use(express.json());
app.use("/api", userRoutes);

// // Add a test route
// app.get("/", (req, res) => {
//   res.send("Server is up and running!");
// });

app.listen(3000, () => console.log("Listening...."));
