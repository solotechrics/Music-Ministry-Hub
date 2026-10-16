const express = require("express");
const songRoutes = require("./routes/songs");
const { notFound, errorHandler } = require("./middleware/errorHandler");

const app = express();

app.use(express.json());

app.get("/api/health", (req, res) => {
    res.status(200).json({ status: "ok" });
});

app.use("/api/songs", songRoutes);

app.use(notFound);
app.use(errorHandler);

module.exports = app;
