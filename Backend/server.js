require('dotenv').config()
const app = require('./src/app')

// Database connection
const connectDB = require('./src/config/db')
connectDB()

// Server setup
const PORT = process.env.PORT || 4242

// Start the server
const server = app.listen(PORT, () => {
  console.log(`Server is running on http://localhost:${PORT}`);
});

// Error handling
process.on('unhandledRejection', (err) => {
  console.log('UNHANDLED REJECTION! Shutting down...');
  console.log(err.name, err.message);
  server.close(() => process.exit(1));
});