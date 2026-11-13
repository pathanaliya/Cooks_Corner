const mongoose = require("mongoose");
const dotenv = require('dotenv');
const dns = require('dns');

dotenv.config();

// Use public DNS servers for Atlas SRV resolution if local DNS blocks querySrv requests.
dns.setServers(['8.8.8.8', '1.1.1.1']);

const url = process.env.MONGO_URI;

if (!url) {
  console.error("Missing MONGO_URI environment variable in .env or process environment.");
  process.exit(1);
}

const connectToMongoDb = async () => {
  try {
    await mongoose.connect(url, {
      serverSelectionTimeoutMS: 5000,
    });
    console.log("MongoDB connected successfully.");
  } catch (err) {
    console.error("MongoDB connection error:", err.message || err);
    process.exit(1);
  }
};

module.exports = connectToMongoDb;