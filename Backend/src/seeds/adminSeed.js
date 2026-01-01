require("dotenv").config();
const User = require("../models/userModel");
const connectDB = require("../config/db");
const fs = require("fs");

const seedAdmin = async () => {
  try {
    console.log("Connecting to database...");
    await connectDB();

    const { ADMIN_EMAIL, ADMIN_PASSWORD } = process.env;

    if (!ADMIN_EMAIL || !ADMIN_PASSWORD) {
      console.log("ADMIN_EMAIL or ADMIN_PASSWORD missing in .env");
      return process.exit(1);
    }

    console.log("Checking if admin already exists...");
    const existingAdmin = await User.findOne({ email: ADMIN_EMAIL });

    if (existingAdmin) {
      console.log("Admin already exists. Nothing to do.");
      return process.exit(0);
    }

    console.log("Creating admin user...");
    await User.create({
      firstName: "Super",
      lastName: "Admin",
      email: ADMIN_EMAIL,
      password: ADMIN_PASSWORD, // hashed by model hook
      role: "admin",
    });

    console.log("Admin created successfully.");
    process.exit(0);
  } catch (err) {
    console.log("Admin seed failed.");

    // Write minimal error info to a file
    const message = `Admin seed failed:\n${err.message}\n`;
    fs.writeFileSync("error.log", message);

    console.log("Error saved to error.log");
    process.exit(1);
  }
};

seedAdmin();
