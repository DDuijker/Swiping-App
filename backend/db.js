const mongoose = require("mongoose");

const connectDB = async () => {
  try {
    if (process.env.NODE_ENV === "test") {
      console.log("Skipping MongoDB connection in test environment...");
      return;
    }
    await mongoose.connect(process.env.MONGO_URI);
    console.log("MongoDB connected...");
  } catch (error) {
    console.error("Error connecting to MongoDB:", error.message);
    process.exit(1);
  }
};

module.exports = connectDB;
