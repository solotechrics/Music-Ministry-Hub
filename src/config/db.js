"use strict";

const mongoose = require("mongoose");

const connectDB = async function () {
    const uri = process.env.MONGODB_URI;

    if (!uri) {
        console.error("MONGODB_URI is missing. Check your .env file.");
        process.exit(1);
    }

    try {
        await mongoose.connect(uri);
        console.log("MongoDB connected");
    } catch (err) {
        console.error("MongoDB connection failed:", err.message);
        process.exit(1);
    }
};

module.exports = connectDB;
