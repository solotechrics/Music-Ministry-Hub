"use strict";

const rateLimit = require("express-rate-limit");

const readPositiveInteger = function (value, fallback) {
    const parsed = Number(value);
    return Number.isInteger(parsed) && parsed > 0 ? parsed : fallback;
};

const createAuthRateLimiter = function (overrides = {}) {
    const testOverride = overrides.forceEnabled === true;
    return rateLimit({
        windowMs: overrides.windowMs || readPositiveInteger(
            process.env.AUTH_RATE_LIMIT_WINDOW_MS,
            15 * 60 * 1000,
        ),
        limit: overrides.limit || readPositiveInteger(
            process.env.AUTH_RATE_LIMIT_MAX,
            10,
        ),
        standardHeaders: "draft-8",
        legacyHeaders: false,
        skip: () => process.env.NODE_ENV === "test" && !testOverride,
    });
};

module.exports = { createAuthRateLimiter };
