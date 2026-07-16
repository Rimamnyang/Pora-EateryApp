/**
 * Run with: npm run seed:admin
 * Creates one admin user using the ADMIN_SEED_* values from your .env file.
 * Public signup only ever creates "customer" role accounts, so this script
 * is how you get your first admin into the database.
 */
require("dotenv").config();
const mongoose = require("mongoose");
const connectDB = require("../config/db");
const User = require("../models/User");

const seedAdmin = async () => {
  await connectDB();

  const email = process.env.ADMIN_SEED_EMAIL;
  const password = process.env.ADMIN_SEED_PASSWORD;
  const name = process.env.ADMIN_SEED_NAME || "Admin User";

  if (!email || !password) {
    console.error("ADMIN_SEED_EMAIL and ADMIN_SEED_PASSWORD must be set in .env");
    process.exit(1);
  }

  const existing = await User.findOne({ email });
  if (existing) {
    console.log(`Admin already exists with email: ${email}`);
    process.exit(0);
  }

  const admin = await User.create({
    name,
    email,
    password,
    role: "admin",
  });

  console.log(`Admin user created: ${admin.email}`);
  process.exit(0);
};

seedAdmin().catch((err) => {
  console.error(err);
  process.exit(1);
});
