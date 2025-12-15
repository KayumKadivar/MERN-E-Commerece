const express = require('express');
const dotenv = require('dotenv');
// const connectDB = require('./src/config/db');

// Connect to the database
// connectDB();

// Load environment variables from .env file
dotenv.config();
const app = express();
const PORT = process.env.PORT || 3000;

// Middleware to parse JSON requests
app.use(express.json());

// Sample route
app.get('/', (req, res) => {
  res.send('Hello, World!');
});

// Start the server
app.listen(PORT, () => {
  console.log(`Server is running on http://localhost:${PORT}`);
});