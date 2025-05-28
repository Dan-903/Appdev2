const express = require("express");
const mongoose = require("mongoose");
require("dotenv").config();
const bookRoutes = require("./routes/bookRoutes");

const app = express();

// Middleware to parse JSON bodies
app.use(express.json());
// Middleware to parse URL-encoded bodies
app.use(express.urlencoded({ extended: true }));

// Connect to MongoDB
mongoose
  .connect(process.env.MONGODB_URI)
  .then(() => console.log("Connected to MongoDB"))
  .catch((err) => console.error("Could not connect to MongoDB:", err));

app.get("/", (req, res) => {
  res.send("Simple Book API using Node.js, Express, and MongoDB");
});

app.use("/api/books", bookRoutes);

const PORT = 3000;
app.listen(PORT, () => {
  console.log(`Server is running on http://localhost:${PORT}`);
});
