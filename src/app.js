"use strict";

const express = require("express");
const helmet = require("helmet");
const cors = require("cors");
const songRoutes = require("./routes/songs");
const authRoutes = require("./routes/auth");
const assignmentRoutes = require("./routes/assignments");
const submissionRoutes = require("./routes/submissions");
const { notFound, errorHandler } = require("./middleware/errorHandler");

const app = express();

const allowedOrigins = (process.env.CORS_ORIGIN || "http://localhost:3000")
    .split(",")
    .map((origin) => origin.trim())
    .filter(Boolean);

app.set("trust proxy", 1);
app.use(helmet());
app.use(cors({ origin: allowedOrigins, credentials: true }));
app.use(express.json({ limit: "100kb" }));

app.get("/api/health", (req, res) => {
    res.status(200).json({ status: "ok" });
});

app.use("/api/songs", songRoutes);
app.use("/api/auth", authRoutes);
app.use("/api/assignments", assignmentRoutes);
app.use("/api/submissions", submissionRoutes);

app.use(notFound);
app.use(errorHandler);

module.exports = app;
