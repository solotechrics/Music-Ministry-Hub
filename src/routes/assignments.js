"use strict";

const express = require("express");
const mongoose = require("mongoose");
const Assignment = require("../models/Assignment");
const Song = require("../models/Song");
const Submission = require("../models/Submission");
const { authenticate, authorize } = require("../middleware/authMiddleware");
const { validate } = require("../middleware/validate");
const {
    assignmentCreateSchema,
    assignmentUpdateSchema,
    submissionCreateSchema,
} = require("../validators/schemas");

const router = express.Router();
router.use(authenticate);

const ALLOWED_FIELDS = [
    "song",
    "title",
    "type",
    "audience",
    "instructions",
    "tutorialLink",
    "deadline",
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
        error: { code: "NOT_FOUND", message: "Assignment not found" },
    });
};

router.param("id", (req, res, next, id) => {
    if (!mongoose.isObjectIdOrHexString(id)) {
        return res.status(400).json({
            error: { code: "INVALID_ID", message: "Invalid assignment id" },
        });
    }
    next();
});

router.post(
    "/:id/submissions",
    authorize("member"),
    validate(submissionCreateSchema),
    async (req, res) => {
    const assignment = await Assignment.findById(req.params.id);
    if (!assignment) return sendNotFound(res);

    const memberType = req.member.memberType;
    if (
        (assignment.audience === "choristers" && memberType !== "chorister") ||
        (assignment.audience === "instrumentalists" &&
            memberType !== "instrumentalist")
    ) {
        return res.status(403).json({
            error: {
                code: "FORBIDDEN",
                message: "This assignment is not for your group",
            },
        });
    }

    const submission = await Submission.create({
        assignment: req.params.id,
        member: req.member._id,
        link: req.body && req.body.link,
        note: req.body && req.body.note,
        isLate: new Date() > assignment.deadline,
    });
    res.status(201).json(submission);
    },
);

router.get("/:id/submissions", authorize("director"), async (req, res) => {
    const assignment = await Assignment.findById(req.params.id);
    if (!assignment) return sendNotFound(res);

    const submissions = await Submission.find({ assignment: req.params.id }).populate(
        "member",
        "fullName memberType part",
    );
    res.status(200).json(submissions);
});

router.post(
    "/",
    authorize("director"),
    validate(assignmentCreateSchema),
    async (req, res) => {
    const data = pickFields(req.body);
    const song = await Song.findById(data.song);
    if (!song) {
        return res.status(404).json({
            error: { code: "NOT_FOUND", message: "Song not found" },
        });
    }

    const assignment = await Assignment.create({
        ...data,
        createdBy: req.member._id,
    });
    res.status(201).json(assignment);
    },
);

router.get("/", async (req, res) => {
    const assignments = await Assignment.find()
        .sort({ createdAt: -1 })
        .populate("song", "title musicalKey");
    res.status(200).json(assignments);
});

router.get("/:id", async (req, res) => {
    const assignment = await Assignment.findById(req.params.id).populate(
        "song",
        "title musicalKey",
    );
    if (!assignment) return sendNotFound(res);
    res.status(200).json(assignment);
});

router.put(
    "/:id",
    authorize("director"),
    validate(assignmentUpdateSchema),
    async (req, res) => {
    const assignment = await Assignment.findById(req.params.id);
    if (!assignment) return sendNotFound(res);

    if (!assignment.createdBy.equals(req.member._id)) {
        return res.status(403).json({
            error: {
                code: "FORBIDDEN",
                message: "You can only change your own assignments",
            },
        });
    }

    const data = pickFields(req.body);
    delete data.song;
    assignment.set(data);
    await assignment.save();
    res.status(200).json(assignment);
    },
);

router.delete("/:id", authorize("director"), async (req, res) => {
    const assignment = await Assignment.findById(req.params.id);
    if (!assignment) return sendNotFound(res);

    if (!assignment.createdBy.equals(req.member._id)) {
        return res.status(403).json({
            error: {
                code: "FORBIDDEN",
                message: "You can only change your own assignments",
            },
        });
    }

    // Step 8: block deleting an assignment that has submissions (409).
    await assignment.deleteOne();
    res.status(200).json({ message: "Assignment deleted" });
});

module.exports = router;
