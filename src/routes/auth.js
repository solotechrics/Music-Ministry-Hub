"use strict";

const express = require("express");
const jwt = require("jsonwebtoken");
const Member = require("../models/Member");
const router = express.Router();

const ALLOWED_FIELDS = ["fullName", "email", "password", "memberType", "part"];

const pickFields = function (body) {
    const data = {};
    for (const field of ALLOWED_FIELDS) {
        if (body && body[field] !== undefined) {
            data[field] = body[field];
        }
    }
    return data;
};

const badRequest = function (res) {
    return res.status(400).json({
        error: {
            code: "VALIDATION_ERROR",
            message: "email and password are required",
        },
    });
};

const invalidCredentials = function (res) {
    return res.status(401).json({
        error: {
            code: "INVALID_CREDENTIALS",
            message: "Invalid email or password",
        },
    });
};

// My signup route
router.post("/signup", async (req, res) => {
    const member = await Member.create(pickFields(req.body));
    res.status(201).json(member);
});

// My login route
router.post("/login", async (req, res) => {
    const { email, password } = req.body || {};
    if (
        !email ||
        !password ||
        typeof email !== "string" ||
        typeof password !== "string"
    ) {
        return badRequest(res);
    }

    const member = await Member.findOne({
        email: email.toLowerCase(),
    }).select("+password");

    if (!member || !(await member.comparePassword(password))) {
        return invalidCredentials(res);
    }

    const token = jwt.sign(
        { id: member._id, role: member.role },
        process.env.JWT_SECRET,
        { expiresIn: process.env.JWT_EXPIRES_IN || "1d" },
    );

    res.status(200).json({ token, member });
});

module.exports = router;
