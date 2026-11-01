"use strict";

const express = require("express");
const request = require("supertest");
const { createAuthRateLimiter } = require("../src/middleware/authRateLimit");
const api = require("../src/app");

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
