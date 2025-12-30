/**
 * Admin Seed Script
 * 
 * Run this script to create a default admin user in the database.
 * Usage: node src/seeds/adminSeed.js
 */

const mongoose = require('mongoose');
const bcrypt = require('bcrypt');
const dotenv = require('dotenv');
const path = require('path');

// Load environment variables
dotenv.config({ path: path.join(__dirname, '../../.env') });

// Import User model
const User = require('../models/userModel');

// Default admin credentials
const adminData = {
    firstName: 'Super',
    lastName: 'Admin',
    email: 'admin@shopwise.com',
    password: 'Admin@123',
    phone: '9999999999',
    role: 'super_admin',
    status: 'active',
    isEmailVerified: true,
    isMobileVerified: true
};

// Connect to MongoDB and create admin
const seedAdmin = async () => {
    try {
        // Connect to MongoDB
        await mongoose.connect(process.env.MONGODB_URL);
        console.log('✅ Connected to MongoDB');

        // Check if admin already exists
        const existingAdmin = await User.findOne({ email: adminData.email });

        if (existingAdmin) {
            console.log('⚠️  Admin already exists with email:', adminData.email);
            console.log('   Skipping seed...');
        } else {
            // Create admin user (password will be hashed by model middleware)
            const admin = await User.create(adminData);

            console.log('✅ Admin created successfully!');
            console.log('━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━');
            console.log('   Email:    ', adminData.email);
            console.log('   Password: ', adminData.password);
            console.log('   Role:     ', adminData.role);
            console.log('━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━');
        }

        // Disconnect from MongoDB
        await mongoose.disconnect();
        console.log('✅ Disconnected from MongoDB');
        process.exit(0);

    } catch (error) {
        console.error('❌ Error seeding admin:', error.message);
        process.exit(1);
    }
};

// Run the seed function
seedAdmin();
