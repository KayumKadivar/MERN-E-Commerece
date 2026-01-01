const express = require('express')
const cors = require('cors')
const userRoutes = require('./routes/userRoutes')
const adminRoutes = require('./routes/adminRoutes')
const testMail = require('./routes/testMail')
const cookieParser = require('cookie-parser')

// Initialize app
const app = express()

// Enable CORS
app.use(cors())

// Parse JSON bodies
app.use(express.json())
app.use(cookieParser())

// Routes
app.use('/api/auth/user', userRoutes);
app.use('/api/auth/admin', adminRoutes);
app.use('/api/auth', testMail);

// Error Middleware
app.use(require('./middlewares/errorMiddleware'));

module.exports = app