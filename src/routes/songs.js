"use strict";

const express = require("express");
const mongoose = require("mongoose");
const Song = require("../models/Song");
const Assignment = require("../models/Assignment");
const { authenticate, authorize } = require("../middleware/authMiddleware");
const { validate } = require("../middleware/validate");
const { songSchema } = require("../validators/schemas");

const router = express.Router();
router.use(authenticate);

const ALLOWED_FIELDS = [
    "title",
    "composer",
    "musicalKey",
    "tempoBpm",
    "referenceLink",
    "notes",
];

const pickFields = function (body) {
    const data = {};
    for (const field of ALLOWED_FIELDS) {
        if (body && body[field] !== undefined) {
            data[field] = body[field];
        }
    }
    return data;
};

const sendNotFound = function (res) {
    return res.status(404).json({
        error: { code: "NOT_FOUND", message: "Song not found" },
    });
};

router.param("id", (req, res, next, id) => {
    if (!mongoose.isObjectIdOrHexString(id)) {
        return res.status(400).json({
            error: { code: "INVALID_ID", message: "Invalid song id" },
        });
    }
    next();
});

router.post("/", authorize("director"), validate(songSchema), async (req, res) => {
    const song = await Song.create(pickFields(req.body));
    res.status(201).json(song);
});

router.get("/", async (req, res) => {
    const songs = await Song.find().sort({ title: 1 });
    res.status(200).json(songs);
});

router.get("/:id", async (req, res) => {
    const song = await Song.findById(req.params.id);
    if (!song) return sendNotFound(res);
    res.status(200).json(song);
});

router.get("/:id/assignments", async (req, res) => {
    const song = await Song.findById(req.params.id);
    if (!song) return sendNotFound(res);

    const assignments = await Assignment.find({ song: req.params.id });
    res.status(200).json(assignments);
});

router.put(
    "/:id",
    authorize("director"),
    validate(songSchema),
    async (req, res) => {
    const data = pickFields(req.body);

    await new Song(data).validate();

    const song = await Song.findByIdAndUpdate(req.params.id, data, {
        returnDocument: "after",
        runValidators: true,
    });
    if (!song) return sendNotFound(res);
    res.status(200).json(song);
    },
);

router.delete("/:id", authorize("director"), async (req, res) => {
    const song = await Song.findById(req.params.id);
    if (!song) return sendNotFound(res);

    const inUse = await Assignment.countDocuments({ song: req.params.id });
    if (inUse > 0) {
        return res.status(409).json({
            error: {
                code: "CONFLICT",
                message: "Cannot delete a song that still has assignments",
            },
        });
    }

    await song.deleteOne();
    res.status(200).json({ message: "Song deleted" });
});

module.exports = router;
