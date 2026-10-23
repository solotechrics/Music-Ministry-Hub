"use strict";

const mongoose = require("mongoose");

const isValidUrl = function (value) {
    try {
        const url = new URL(value);
        return url.protocol === "http:" || url.protocol === "https:";
    } catch {
        return false;
    }
};

const assignmentSchema = new mongoose.Schema(
    {
        song: {
            type: mongoose.Schema.Types.ObjectId,
            ref: "Song",
            required: [true, "song is required"],
        },
        createdBy: {
            type: mongoose.Schema.Types.ObjectId,
            ref: "Member",
            required: [true, "createdBy is required"],
        },
        title: {
            type: String,
            required: [true, "title is required"],
            trim: true,
            maxlength: [120, "title must be 120 characters or less"],
        },
        type: {
            type: String,
            enum: ["sight_singing", "sight_reading", "by_ear"],
            required: [true, "type is required"],
        },
        audience: {
            type: String,
            enum: ["choristers", "instrumentalists", "all"],
            required: [true, "audience is required"],
        },
        instructions: {
            type: String,
            required: [true, "instructions is required"],
            trim: true,
        },
        tutorialLink: {
            type: String,
            trim: true,
            validate: {
                validator: isValidUrl,
                message: "tutorialLink must be a valid http or https URL",
            },
        },
        deadline: {
            type: Date,
            required: [true, "deadline is required"],
            validate: {
                validator: (value) => value > new Date(),
                message: "deadline must be in the future",
            },
        },
    },
    { timestamps: true },
);

module.exports = mongoose.model("Assignment", assignmentSchema);
