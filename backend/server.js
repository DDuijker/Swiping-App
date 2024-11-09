const express = require("express");
const cors = require("cors");
const bodyParser = require("body-parser");
const connectDB = require("./db");
const userRoutes = require("./routes/userRoutes");
require("dotenv").config();

const app = express();
const PORT = process.env.PORT || 5000;
connectDB();
// Middleware
app.use(cors()); // Enable CORS
app.use(bodyParser.json({ limit: "10mb" })); // Parse JSON request bodies
app.use(express.json({ limit: "10mb" }));
app.use(express.urlencoded({ limit: "10mb", extended: true }));

// Sample route
app.get("/", (req, res) => {
  res.send("Hello, World!");
});

app.use("/api/user", userRoutes);

// Start the server
app.listen(PORT, () => {
  console.log(`Server is running on http://localhost:${PORT}`);
});
