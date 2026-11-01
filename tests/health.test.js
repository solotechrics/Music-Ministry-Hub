process.env.JWT_SECRET = "test-secret";
const request = require("supertest");
const app = require("../src/app");

describe("API basics (no database needed)", () => {
    it("GET /api/health returns 200 without a token", async () => {
        const res = await request(app).get("/api/health");
        expect(res.status).toBe(200);
        expect(res.body).toEqual({ status: "ok" });
    });

    it("GET /api/songs returns 401 with no token", async () => {
        const res = await request(app).get("/api/songs");
        expect(res.status).toBe(401);
        expect(res.body.error.code).toBe("UNAUTHENTICATED");
    });

    it("unknown route returns 404 in the standard format", async () => {
        const res = await request(app).get("/api/nothing");
        expect(res.status).toBe(404);
        expect(res.body.error.code).toBe("NOT_FOUND");
    });
});
