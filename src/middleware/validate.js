"use strict";

const validate = function (schema) {
    return function (req, res, next) {
        const result = schema.safeParse(req.body || {});

        if (!result.success) {
            const message = result.error.issues
                .map((issue) =>
                    issue.path.length ?
                        `${issue.path.join(".")}: ${issue.message}`
                    :   issue.message,
                )
                .join(", ");
            return res.status(400).json({
                error: { code: "VALIDATION_ERROR", message },
            });
        }

        req.body = result.data;
        next();
    };
};

module.exports = { validate };
