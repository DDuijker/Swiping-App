const express = require("express");
const cors = require("cors");
const bodyParser = require("body-parser");
const connectDB = require("./db");
const userRoutes = require("./routes/userRoutes");
const groupRoutes = require("./routes/groupRoutes");
require("dotenv").config();

const app = express();
const PORT = process.env.PORT || 5000;

// Connect to MongoDB only in non-test environments
if (process.env.NODE_ENV !== "test") {
  connectDB();
}

// Middleware
app.use(cors());
app.use(bodyParser.json({ limit: "10mb" }));
app.use(express.json({ limit: "10mb" }));
app.use(express.urlencoded({ limit: "10mb", extended: true }));

// Sample route
app.get("/", (req, res) => {
  res.send("Hello, World!");
});

// Routes
app.use("/api/user", userRoutes);
app.use("/api/groups", groupRoutes);

// Start server only if not in test environment
let server = null;

if (process.env.NODE_ENV !== "test") {
  server = app.listen(PORT, () => {
    console.log(`Server is running on http://localhost:${PORT}`);
  });
}

module.exports = { app, server };
