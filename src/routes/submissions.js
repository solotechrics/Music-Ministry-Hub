"use strict";

const express = require("express");
const mongoose = require("mongoose");
const Submission = require("../models/Submission");
const Assignment = require("../models/Assignment");
const { authenticate, authorize } = require("../middleware/authMiddleware");
const { validate } = require("../middleware/validate");
const isLate = require("../utils/isLate");
const { submissionUpdateSchema, paginationSchema } = require("../validators/schemas");
const { validateQuery } = require("../middleware/validate");

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

router.get("/mine", authorize("member"), validateQuery(paginationSchema), async (req, res) => {
    const { page, limit } = req.pagination;
    const filter = { member: req.member._id };
    const [data, total] = await Promise.all([
        Submission.find(filter)
            .sort({ createdAt: -1 })
            .skip((page - 1) * limit)
            .limit(limit)
            .populate("assignment", "title deadline"),
        Submission.countDocuments(filter),
    ]);
    res.status(200).json({ data, page, limit, total, totalPages: Math.ceil(total / limit) });
});

router.get("/:id", authorize("member"), async (req, res) => {
    const submission = await Submission.findById(req.params.id).populate(
        "assignment",
        "title deadline",
    );
    if (!submission) return sendNotFound(res);
    if (!submission.member.equals(req.member._id)) {
        return res.status(403).json({
            error: {
                code: "FORBIDDEN",
                message: "You can only view your own submissions",
            },
        });
    }
    res.status(200).json(submission);
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

    const assignment = await Assignment.findById(submission.assignment);
    if (!assignment) {
        return res.status(404).json({
            error: { code: "NOT_FOUND", message: "Assignment not found" },
        });
    }

    submission.set(pickFields(req.body));
    submission.isLate = isLate(new Date(), assignment.deadline);
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
