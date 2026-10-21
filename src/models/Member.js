"use strict";

const mongoose = require("mongoose");
const bcrypt = require("bcryptjs");

const emailValidation = /^\S+@\S+\.\S+$/;
const memberSchema = new mongoose.Schema(
    {
        fullName: {
            type: String,
            required: [true, "full name is required"],
            trim: true,
            maxlength: [100, "full name must be 100 characters or less"],
        },

        email: {
            type: String,
            required: [true, "email is required"],
            lowercase: true,
            unique: true,
            trim: true,
            match: [emailValidation, "email is not valid"],
        },

        password: {
            type: String,
            required: [true, "password is required"],
            minlength: [8, "password must be at least 8 characters"],
            select: false,
        },

        role: {
            type: String,
            enum: ["director", "member"],
            default: "member",
        },

        part: {
            type: String,
            required: false,
        },

        memberType: {
            type: String,
            enum: ["chorister", "instrumentalist"],
            required: [true, "memberType is required"],
        },
    },
    {
        timestamps: true,
        toJSON: {
            transform: (doc, ret) => {
                delete ret.password;
                delete ret.__v;
                return ret;
            },
        },
    },
);

memberSchema.pre("save", async function () {
    if (!this.isModified("password")) return;
    this.password = await bcrypt.hash(this.password, 10);
});

memberSchema.methods.comparePassword = function (plainPassword) {
    return bcrypt.compare(plainPassword, this.password);
};

module.exports = mongoose.model("Member", memberSchema);
