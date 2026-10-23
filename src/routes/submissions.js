"use strict";

const express = require("express");
const mongoose = require("mongoose");
const Submission = require("../models/Submission");
const { authenticate, authorize } = require("../middleware/authMiddleware");
const { validate } = require("../middleware/validate");
const { submissionUpdateSchema } = require("../validators/schemas");

const router = express.Router();
router.use(authenticate);

const ALLOWED_FIELDS = ["link", "note"];

const pickFields = function (body) {
    const data = {};
    for (const field of ALLOWED_FIELDS) {
        if (body && body[field] !== undefined) data[field] = body[field];
    }
    return data;
};

const sendNotFound = function (res) {
    return res.status(404).json({
        error: { code: "NOT_FOUND", message: "Submission not found" },
    });
};

router.param("id", (req, res, next, id) => {
    if (!mongoose.isObjectIdOrHexString(id)) {
        return res.status(400).json({
            error: { code: "INVALID_ID", message: "Invalid submission id" },
        });
    }
    next();
});

router.get("/mine", authorize("member"), async (req, res) => {
    const submissions = await Submission.find({ member: req.member._id }).populate(
        "assignment",
        "title deadline",
    );
    res.status(200).json(submissions);
});

router.put(
    "/:id",
    authorize("member"),
    validate(submissionUpdateSchema),
    async (req, res) => {
    const submission = await Submission.findById(req.params.id);
    if (!submission) return sendNotFound(res);
    if (!submission.member.equals(req.member._id)) {
        return res.status(403).json({
            error: {
                code: "FORBIDDEN",
                message: "You can only change your own submissions",
            },
        });
    }

    submission.set(pickFields(req.body));
    await submission.save();
    res.status(200).json(submission);
    },
);

router.delete("/:id", authorize("member"), async (req, res) => {
    const submission = await Submission.findById(req.params.id);
    if (!submission) return sendNotFound(res);
    if (!submission.member.equals(req.member._id)) {
        return res.status(403).json({
            error: {
                code: "FORBIDDEN",
                message: "You can only change your own submissions",
            },
        });
    }

    await submission.deleteOne();
    res.status(200).json({ message: "Submission deleted" });
});

module.exports = router;
