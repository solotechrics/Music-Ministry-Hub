"use strict";

process.env.JWT_SECRET = "test-secret";

const jwt = require("jsonwebtoken");
const Member = require("../src/models/Member");
const {
    signupSchema,
    loginSchema,
    songSchema,
    assignmentCreateSchema,
    submissionCreateSchema,
} = require("../src/validators/schemas");
const { authenticate, authorize } = require("../src/middleware/authMiddleware");
const isLate = require("../src/utils/isLate");

const response = function () {
    return { status: jest.fn().mockReturnThis(), json: jest.fn() };
};

describe("Zod schemas", () => {
    it("removes MongoDB operator and dotted keys from validated login data", () => {
        const result = loginSchema.safeParse({
            email: "member@example.com",
            password: "Password123",
            $where: "this.role === 'director'",
            "email.password": "unexpected",
        });
        expect(result.success).toBe(true);
        expect(result.data).toEqual({
            email: "member@example.com",
            password: "Password123",
        });
    });

    it("accepts and normalizes valid signup input", () => {
        const result = signupSchema.safeParse({
            fullName: "  Test Person ",
            email: "TEST@example.com",
            password: "Password123",
            memberType: "chorister",
        });
        expect(result.success).toBe(true);
        expect(result.data.email).toBe("test@example.com");
    });

    it("rejects invalid signup input", () => {
        expect(signupSchema.safeParse({ email: "bad", password: "x" }).success).toBe(false);
    });

    it("accepts valid song input and rejects an invalid key", () => {
        expect(songSchema.safeParse({ title: "Song", musicalKey: "F#" }).success).toBe(true);
        expect(songSchema.safeParse({ title: "Song", musicalKey: "H" }).success).toBe(false);
    });

    it("checks assignment and submission inputs", () => {
        expect(assignmentCreateSchema.safeParse({
            song: "507f1f77bcf86cd799439011",
            title: "Practice",
            type: "by_ear",
            audience: "all",
            instructions: "Listen",
            deadline: new Date(Date.now() + 60000).toISOString(),
        }).success).toBe(true);
        expect(submissionCreateSchema.safeParse({ link: "javascript:alert(1)" }).success).toBe(false);
    });
});

describe("authentication and authorization middleware", () => {
    afterEach(() => jest.restoreAllMocks());

    it("rejects missing and invalid bearer tokens", async () => {
        const res = response();
        await authenticate({ headers: {} }, res, jest.fn());
        expect(res.status).toHaveBeenCalledWith(401);

        const badRes = response();
        await authenticate({ headers: { authorization: "Bearer invalid" } }, badRes, jest.fn());
        expect(badRes.status).toHaveBeenCalledWith(401);
    });

    it("loads the authenticated member and passes control", async () => {
        const member = { _id: "member-id", role: "director" };
        const findById = jest.spyOn(Member, "findById").mockResolvedValue(member);
        const next = jest.fn();
        const req = {
            headers: { authorization: `Bearer ${jwt.sign({ id: "member-id" }, process.env.JWT_SECRET)}` },
        };
        await authenticate(req, response(), next);
        expect(findById).toHaveBeenCalledWith("member-id");
        expect(req.member).toBe(member);
        expect(next).toHaveBeenCalled();
    });

    it("allows a matching role and rejects a different role", () => {
        const next = jest.fn();
        authorize("director")({ member: { role: "director" } }, response(), next);
        expect(next).toHaveBeenCalled();
        const res = response();
        authorize("director")({ member: { role: "member" } }, res, jest.fn());
        expect(res.status).toHaveBeenCalledWith(403);
    });
});

describe("isLate rule", () => {
    it("returns false before and at the deadline, true after it", () => {
        const deadline = new Date("2030-01-01T00:00:00.000Z");
        expect(isLate("2029-12-31T23:59:59.999Z", deadline)).toBe(false);
        expect(isLate(deadline, deadline)).toBe(false);
        expect(isLate("2030-01-01T00:00:00.001Z", deadline)).toBe(true);
    });
});
