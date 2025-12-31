const express = require('express')
const cors = require('cors')
const userRoutes = require('./routes/userRoutes')

// Initialize app
const app = express()
// Enable CORS
app.use(cors())

// Parse JSON bodies
app.use(express.json())

// Routes
app.use('/api/auth/users', userRoutes);

module.exports = app