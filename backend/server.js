const express = require('express');
const bodyParser = require('body-parser');
const connectDB = require('./config/connectDB');  // Import the connection function

// Initialize the app
const app = express();

// Middleware
app.use(bodyParser.json());

// Connect to MongoDB Atlas
connectDB();

// Define Routes
app.use('/api/users', require('./routes/userRoutes'));

// Start the server
const PORT = process.env.PORT || 5001;
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
