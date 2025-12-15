// Import express framework to create the web server
const express = require('express');

// Import database connection function from config folder
const connectDB = require('./src/config/db');

// Import CORS middleware to handle Cross-Origin Resource Sharing
// This allows your frontend (running on different port/domain) to access this API
const cors = require('cors');

// Load environment variables from .env file into process.env
require('dotenv').config();

// Create an Express application instance
const app = express();

// Set the server port from environment variable or use 4242 as default
const PORT = process.env.PORT || 4242;

// Connect to MongoDB database
// This function establishes connection to the database defined in .env
connectDB();

// CORS Configuration
// This allows requests from different origins (e.g., React app on port 3000)
const corsOptions = {
  origin: '*', // Allow all origins (for development). In production, specify your frontend URL
  methods: ['GET', 'POST', 'PUT', 'DELETE', 'PATCH'], // Allowed HTTP methods
  allowedHeaders: ['Content-Type', 'Authorization'], // Allowed headers
  credentials: true // Allow cookies and authentication headers
};

// Apply CORS middleware with configuration
app.use(cors(corsOptions));

// Middleware to parse incoming JSON requests
// This allows us to access req.body in our controllers
app.use(express.json());

// Mount user authentication routes on /api/auth path
// All routes from userRoutes.js will be prefixed with /api/auth
// Example: POST /api/auth/register, POST /api/auth/login
app.use('/api/auth', require('./src/routes/userRoutes'));

// Start the server and listen on the specified port
// This makes the server accessible at http://localhost:PORT
app.listen(PORT, () => {
  console.log(`Server is running on http://localhost:${PORT}`);
});