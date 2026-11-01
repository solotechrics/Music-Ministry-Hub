"use strict";

const isLate = function (submittedAt, deadline) {
    return new Date(submittedAt) > new Date(deadline);
};

module.exports = isLate;
