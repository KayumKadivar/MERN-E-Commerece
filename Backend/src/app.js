const express = require('express')
const cors = require('cors')
const userRoutes = require('./routes/userRoutes')
const adminRoutes = require('./routes/adminRoutes')
const testMail = require('./routes/testMail')
const cookieParser = require('cookie-parser')

const bodyParser = require('body-parser');

// Initialize app
const app = express()

// Enable CORS
app.use(cors())

// Parse JSON bodies
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));
app.use(cookieParser())

// Debug Middleware to check req.body
app.use((req, res, next) => {
    console.log(`[${req.method}] ${req.url}`);
    console.log('Content-Type:', req.headers['content-type']);
    console.log('req.body:', req.body);
    next();
});

// Routes
app.use('/api/auth/user', userRoutes);
app.use('/api/admin', adminRoutes);
app.use('/api/auth', testMail);

// Error Middleware
app.use(require('./middlewares/errorMiddleware'));

module.exports = app