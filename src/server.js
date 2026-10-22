"use strict";

require("dotenv").config();

const app = require("./app");
const connectDB = require("./config/db");

const PORT = process.env.PORT || 3006;

const start = async function () {
    if (!process.env.JWT_SECRET) {
        console.error("JWT_SECRET is missing. Check your .env file.");
        process.exit(1);
    }

    await connectDB();
    app.listen(PORT, () => {
        console.log(`Server running on http://localhost:${PORT}`);
    });
};

start();
