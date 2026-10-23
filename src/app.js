"use strict";

const express = require("express");
const songRoutes = require("./routes/songs");
const authRoutes = require("./routes/auth");
const assignmentRoutes = require("./routes/assignments");
const { notFound, errorHandler } = require("./middleware/errorHandler");

const app = express();

app.use(express.json());

app.get("/api/health", (req, res) => {
    res.status(200).json({ status: "ok" });
});

app.use("/api/songs", songRoutes);
app.use("/api/auth", authRoutes);
app.use("/api/assignments", assignmentRoutes);

app.use(notFound);
app.use(errorHandler);

module.exports = app;
