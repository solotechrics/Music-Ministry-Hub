"use strict";

const jwt = require("jsonwebtoken");
const Member = require("../models/Member");

const unauthenticated = function (res) {
    return res.status(401).json({
        error: {
            code: "UNAUTHENTICATED",
            message: "Please log in to continue",
        },
    });
};

const forbidden = function (res) {
    return res.status(403).json({
        error: {
            code: "FORBIDDEN",
            message: "You do not have permission to do this",
        },
    });
};

const authenticate = async function (req, res, next) {
    const header = req.headers.authorization || "";

    if (!header.startsWith("Bearer ")) {
        return unauthenticated(res);
    }

    const token = header.slice(7);

    let payload;
    try {
        payload = jwt.verify(token, process.env.JWT_SECRET);
    } catch (error) {
        return unauthenticated(res);
    }

    const member = await Member.findById(payload.id);
    if (!member) {
        return unauthenticated(res);
    }

    req.member = member;
    next();
};

const authorize = function (...roles) {
    return function (req, res, next) {
        if (!roles.includes(req.member.role)) {
            return forbidden(res);
        }
        next();
    };
};

module.exports = { authenticate, authorize };
