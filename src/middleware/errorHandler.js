function notFound(req, res) {
    res.status(404).json({
        error: { code: "NOT_FOUND", message: "Route not found" },
    });
}

function errorHandler(err, req, res, next) {
    if (err.name === "ValidationError") {
        const message = Object.values(err.errors)
            .map((e) =>
                e.name === "CastError" ?
                    `${e.path} has an invalid value`
                :   e.message,
            )
            .join(", ");
        return res.status(400).json({
            error: { code: "VALIDATION_ERROR", message },
        });
    }

    if (err.name === "CastError") {
        return res.status(400).json({
            error: {
                code: "INVALID_INPUT",
                message: `Invalid value for ${err.path}`,
            },
        });
    }

    if (err.type === "entity.parse.failed") {
        return res.status(400).json({
            error: {
                code: "INVALID_JSON",
                message: "Request body is not valid JSON",
            },
        });
    }

    console.error(err);
    res.status(500).json({
        error: { code: "SERVER_ERROR", message: "Something went wrong" },
    });
}

module.exports = { notFound, errorHandler };
