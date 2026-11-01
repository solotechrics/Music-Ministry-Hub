process.env.JWT_SECRET = "test-secret";
const request = require("supertest");
const app = require("../src/app");

describe("API basics (no database needed)", () => {
    it("GET /api/health returns 200 without a token", async () => {
        const res = await request(app).get("/api/health");
        expect(res.status).toBe(200);
        expect(res.body).toEqual({ status: "ok" });
        expect(res.headers["x-content-type-options"]).toBe("nosniff");
    });

    it("allows only the configured default browser origin", async () => {
        const allowed = await request(app)
            .options("/api/health")
            .set("Origin", "http://localhost:3000")
            .set("Access-Control-Request-Method", "GET");
        expect(allowed.headers["access-control-allow-origin"]).toBe("http://localhost:3000");

        const denied = await request(app)
            .options("/api/health")
            .set("Origin", "https://untrusted.example")
            .set("Access-Control-Request-Method", "GET");
        expect(denied.headers["access-control-allow-origin"]).toBeUndefined();
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
