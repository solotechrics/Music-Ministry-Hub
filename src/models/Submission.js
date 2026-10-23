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

const submissionSchema = new mongoose.Schema(
    {
        assignment: {
            type: mongoose.Schema.Types.ObjectId,
            ref: "Assignment",
            required: [true, "assignment is required"],
        },
        member: {
            type: mongoose.Schema.Types.ObjectId,
            ref: "Member",
            required: [true, "member is required"],
        },
        link: {
            type: String,
            required: [true, "link is required"],
            trim: true,
            validate: {
                validator: isValidUrl,
                message: "link must be a valid http or https URL",
            },
        },
        note: {
            type: String,
            trim: true,
            maxlength: [500, "note must be 500 characters or less"],
        },
        isLate: { type: Boolean, default: false },
    },
    { timestamps: true },
);

submissionSchema.index({ assignment: 1, member: 1 }, { unique: true });

module.exports = mongoose.model("Submission", submissionSchema);
