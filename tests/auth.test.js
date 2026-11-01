const request = require("supertest");
const app = require("../src/app");
const { connectTestDB, clearDB, closeDB, DB_STARTUP_TIMEOUT_MS } = require("./helpers");

beforeAll(connectTestDB, DB_STARTUP_TIMEOUT_MS);
beforeEach(clearDB);
afterAll(closeDB);

const validMember = {
    fullName: "Test Chorister",
    email: "test.chorister@example.com",
    password: "Password123",
    memberType: "chorister",
};

describe("POST /api/auth/signup", () => {
    it("creates a member and never returns the password", async () => {
        const res = await request(app).post("/api/auth/signup").send(validMember);
        expect(res.status).toBe(201);
        expect(res.body.email).toBe(validMember.email);
        expect(res.body.password).toBeUndefined();
    });

    it("ignores a role sent in the body", async () => {
        const res = await request(app)
            .post("/api/auth/signup")
            .send({ ...validMember, role: "director" });
        expect(res.status).toBe(201);
        expect(res.body.role).toBe("member");
    });

    it("rejects a short password with 400", async () => {
        const res = await request(app)
            .post("/api/auth/signup")
            .send({ ...validMember, password: "12345" });
        expect(res.status).toBe(400);
        expect(res.body.error.code).toBe("VALIDATION_ERROR");
    });

    it("rejects a duplicate email with 409", async () => {
        await request(app).post("/api/auth/signup").send(validMember);
        const res = await request(app).post("/api/auth/signup").send(validMember);
        expect(res.status).toBe(409);
        expect(res.body.error.code).toBe("DUPLICATE");
    });
});

describe("POST /api/auth/login", () => {
    beforeEach(async () => {
        await request(app).post("/api/auth/signup").send(validMember);
    });

    it("returns a token for correct credentials", async () => {
        const res = await request(app)
            .post("/api/auth/login")
            .send({ email: validMember.email, password: validMember.password });
        expect(res.status).toBe(200);
        expect(typeof res.body.token).toBe("string");
        expect(res.body.member.password).toBeUndefined();
    });

    it("returns 401 for a wrong password", async () => {
        const res = await request(app)
            .post("/api/auth/login")
            .send({ email: validMember.email, password: "WrongPassword1" });
        expect(res.status).toBe(401);
        expect(res.body.error.code).toBe("INVALID_CREDENTIALS");
    });

    it("returns 401 for an unknown email", async () => {
        const res = await request(app)
            .post("/api/auth/login")
            .send({ email: "nobody@example.com", password: "Password123" });
        expect(res.status).toBe(401);
    });

    it("returns 400 when the password is missing", async () => {
        const res = await request(app)
            .post("/api/auth/login")
            .send({ email: validMember.email });
        expect(res.status).toBe(400);
    });
});

describe("GET /api/auth/me", () => {
    it("returns 401 without a token", async () => {
        const res = await request(app).get("/api/auth/me");
        expect(res.status).toBe(401);
    });

    it("returns the logged-in member with a valid token", async () => {
        await request(app).post("/api/auth/signup").send(validMember);
        const login = await request(app)
            .post("/api/auth/login")
            .send({ email: validMember.email, password: validMember.password });
        const res = await request(app)
            .get("/api/auth/me")
            .set("Authorization", `Bearer ${login.body.token}`);
        expect(res.status).toBe(200);
        expect(res.body.email).toBe(validMember.email);
        expect(res.body.password).toBeUndefined();
    });
});
