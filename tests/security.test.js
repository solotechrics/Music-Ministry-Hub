"use strict";

const express = require("express");
const request = require("supertest");
const { createAuthRateLimiter } = require("../src/middleware/authRateLimit");
const api = require("../src/app");
const { errorHandler } = require("../src/middleware/errorHandler");

afterEach(() => jest.restoreAllMocks());

describe("authentication rate limiter", () => {
    it("returns 429 after the configured number of requests", async () => {
        const app = express();
        app.set("trust proxy", 1);
        app.post(
            "/login",
            createAuthRateLimiter({ windowMs: 60_000, limit: 2, forceEnabled: true }),
            (req, res) => res.sendStatus(200),
        );

        const agent = request(app);
        expect((await agent.post("/login")).status).toBe(200);
        expect((await agent.post("/login")).status).toBe(200);
        const blocked = await agent.post("/login");
        expect(blocked.status).toBe(429);
    });
});

describe("JSON body limit", () => {
    it("returns 413 for a body larger than 100 KB", async () => {
        const res = await request(api)
            .post("/api/auth/login")
            .send({ email: "member@example.com", password: "x".repeat(110_000) });
        expect(res.status).toBe(413);
        expect(res.body.error.code).toBe("PAYLOAD_TOO_LARGE");
    });
});

describe("error responses", () => {
    it("does not include exception details or stack traces in a 500 response", () => {
        jest.spyOn(console, "error").mockImplementation(() => {});
        const res = { status: jest.fn().mockReturnThis(), json: jest.fn() };
        const error = new Error("private failure detail");
        error.stack = "private stack trace";

        errorHandler(error, {}, res, jest.fn());

        expect(res.status).toHaveBeenCalledWith(500);
        expect(res.json).toHaveBeenCalledWith({
            error: { code: "SERVER_ERROR", message: "Something went wrong" },
        });
        expect(JSON.stringify(res.json.mock.calls[0][0])).not.toContain("stack");
    });
});
