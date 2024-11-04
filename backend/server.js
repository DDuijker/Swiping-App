const express = require('express');
const cors = require('cors');
const bodyParser = require('body-parser');
const connectDB = require('./db');
const userRoutes = require('./routes/userRoutes')
require('dotenv').config();

const app = express();
const PORT = process.env.PORT || 5000;
connectDB();

// Middleware
app.use(cors()); // Enable CORS
app.use(bodyParser.json()); // Parse JSON request bodies
app.use(express.json())


// Sample route
app.get('/', (req, res) => {
    res.send('Hello, World!');
});

app.use("/api/user", userRoutes);

// Start the server
app.listen(PORT, () => {
    console.log(`Server is running on http://localhost:${PORT}`);
});
