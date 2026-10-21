"use strict";

const mongoose = require("mongoose");

const KEY_PATTERN = /^[A-G][#b]?m?$/;

const isValidUrl = function (value) {
    try {
        const url = new URL(value);
        return url.protocol === "http:" || url.protocol === "https:";
    } catch {
        return false;
    }
};

const songSchema = new mongoose.Schema(
    {
        title: {
            type: String,
            required: [true, "title is required"],
            trim: true,
            maxlength: [120, "title must be 120 characters or less"],
        },
        composer: {
            type: String,
            trim: true,
            maxlength: [100, "composer must be 100 characters or less"],
        },
        musicalKey: {
            type: String,
            required: [true, "musicalKey is required"],
            trim: true,
            match: [KEY_PATTERN, "musicalKey must look like C, F#, Bb or Am"],
        },
        tempoBpm: {
            type: Number,
            min: [30, "tempoBpm must be at least 30"],
            max: [240, "tempoBpm must be at most 240"],
            validate: {
                validator: Number.isInteger,
                message: "tempoBpm must be a whole number",
            },
        },
        referenceLink: {
            type: String,
            trim: true,
            validate: {
                validator: isValidUrl,
                message: "referenceLink must be a valid http or https URL",
            },
        },
        notes: {
            type: String,
            trim: true,
        },
    },
    { timestamps: true },
);

module.exports = mongoose.model("Song", songSchema);
