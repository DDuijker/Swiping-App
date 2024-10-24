const mongoose = require("mongoose");

// Function to connect to MongoDB
const connectDB = async () => {
  try {
    await mongoose.connect(
      "mongodb+srv://marjonphu:hUbper-qazjaw-7sipdo@binge.e4wvz.mongodb.net/?retryWrites=true&w=majority&appName=Binge&tls=true"
    );
    console.log("MongoDB Atlas connected");
  } catch (err) {
    console.error("MongoDB connection error:", err.message);
    process.exit(1); // Exit process with failure
  }
};

module.exports = connectDB;
