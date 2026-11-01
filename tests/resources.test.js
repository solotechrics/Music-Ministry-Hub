"use strict";

process.env.JWT_SECRET = "test-secret";

const request = require("supertest");
const app = require("../src/app");
const Member = require("../src/models/Member");
const Song = require("../src/models/Song");
const Assignment = require("../src/models/Assignment");
const Submission = require("../src/models/Submission");
const { connectTestDB, clearDB, closeDB, DB_STARTUP_TIMEOUT_MS } = require("./helpers");
const { createMember, tokenFor, createSong, createAssignment } = require("./fixtures");

beforeAll(connectTestDB, DB_STARTUP_TIMEOUT_MS);
beforeEach(clearDB);
afterAll(closeDB);

const auth = (token) => ({ Authorization: `Bearer ${token}` });

describe("songs API", () => {
    it("paginates songs and validates pagination parameters", async () => {
        const member = await createMember();
        await Song.create([
            { title: "A Song", musicalKey: "C" },
            { title: "B Song", musicalKey: "G" },
        ]);
        const headers = auth(tokenFor(member));

        const page = await request(app).get("/api/songs?page=2&limit=1").set(headers);
        expect(page.status).toBe(200);
        expect(page.body).toMatchObject({ page: 2, limit: 1, total: 2, totalPages: 2 });
        expect(page.body.data).toHaveLength(1);
        expect(page.body.data[0].title).toBe("B Song");

        const invalid = await request(app).get("/api/songs?page=0").set(headers);
        expect(invalid.status).toBe(400);
        expect(invalid.body.error.code).toBe("VALIDATION_ERROR");
    });

    it("requires authentication and director role for writes", async () => {
        const songData = { title: "Amazing Grace", musicalKey: "G" };
        expect((await request(app).get("/api/songs")).status).toBe(401);
        const member = await createMember();
        const denied = await request(app).post("/api/songs").set(auth(tokenFor(member))).send(songData);
        expect(denied.status).toBe(403);
        expect(denied.body.error.code).toBe("FORBIDDEN");
        const director = await createMember({ role: "director" });
        const created = await request(app).post("/api/songs").set(auth(tokenFor(director))).send(songData);
        expect(created.status).toBe(201);
    });

    it("returns 400 for invalid input or ids and 404 for missing songs", async () => {
        const member = await createMember({ role: "director" });
        const headers = auth(tokenFor(member));
        expect((await request(app).post("/api/songs").set(headers).send({ title: "", musicalKey: "H" })).status).toBe(400);
        expect((await request(app).get("/api/songs/not-an-id").set(headers)).status).toBe(400);
        expect((await request(app).get("/api/songs/507f1f77bcf86cd799439011").set(headers)).status).toBe(404);
    });

    it("blocks deleting a song while assignments refer to it", async () => {
        const director = await createMember({ role: "director" });
        const song = await createSong();
        await createAssignment(song, director);
        const res = await request(app).delete(`/api/songs/${song.id}`).set(auth(tokenFor(director)));
        expect(res.status).toBe(409);
        expect(res.body.error.code).toBe("CONFLICT");
    });
});

describe("assignments API", () => {
    it("paginates assignments and their submissions", async () => {
        const director = await createMember({ role: "director" });
        const member = await createMember();
        const song = await createSong();
        const assignment = await createAssignment(song, director);
        await Submission.create({
            assignment: assignment._id,
            member: member._id,
            link: "https://example.com/submission",
        });
        const directorHeaders = auth(tokenFor(director));

        const assignments = await request(app).get("/api/assignments?limit=1").set(directorHeaders);
        expect(assignments.status).toBe(200);
        expect(assignments.body).toMatchObject({ page: 1, limit: 1, total: 1, totalPages: 1 });
        expect(assignments.body.data).toHaveLength(1);

        const mine = await request(app)
            .get("/api/submissions/mine?limit=1")
            .set(auth(tokenFor(member)));
        expect(mine.status).toBe(200);
        expect(mine.body.total).toBe(1);
        expect(mine.body.data).toHaveLength(1);

        const submissions = await request(app)
            .get(`/api/assignments/${assignment.id}/submissions?page=1&limit=1`)
            .set(directorHeaders);
        expect(submissions.status).toBe(200);
        expect(submissions.body.totalPages).toBe(1);
        expect(submissions.body.data).toHaveLength(1);
    });

    it("lets only a director create assignments and checks missing songs", async () => {
        const director = await createMember({ role: "director" });
        const headers = auth(tokenFor(director));
        const body = {
            song: "507f1f77bcf86cd799439011", title: "Practice", type: "by_ear",
            audience: "all", instructions: "Listen", deadline: new Date(Date.now() + 60000).toISOString(),
        };
        expect((await request(app).post("/api/assignments").set(headers).send(body)).status).toBe(404);
        expect((await request(app).post("/api/assignments").set(headers).send({ ...body, title: "" })).status).toBe(400);
    });

    it("allows only the creating director to edit or delete", async () => {
        const owner = await createMember({ role: "director" });
        const other = await createMember({ role: "director" });
        const song = await createSong();
        const assignment = await createAssignment(song, owner);
        const path = `/api/assignments/${assignment.id}`;
        expect((await request(app).put(path).set(auth(tokenFor(other))).send({ title: "Changed" })).status).toBe(403);
        expect((await request(app).delete(path).set(auth(tokenFor(other)))).status).toBe(403);
        expect((await request(app).put("/api/assignments/bad-id").set(auth(tokenFor(owner))).send({ title: "Changed" })).status).toBe(400);
    });

    it("enforces audience, one submission per member, and assignment deletion conflicts", async () => {
        const director = await createMember({ role: "director" });
        const member = await createMember({ memberType: "instrumentalist" });
        const song = await createSong();
        const assignment = await createAssignment(song, director, { audience: "choristers" });
        const path = `/api/assignments/${assignment.id}/submissions`;
        const headers = auth(tokenFor(member));
        const blocked = await request(app).post(path).set(headers).send({ link: "https://example.com/recording" });
        expect(blocked.status).toBe(403);

        await Assignment.updateOne({ _id: assignment._id }, { audience: "all" });
        const created = await request(app).post(path).set(headers).send({ link: "https://example.com/recording" });
        expect(created.status).toBe(201);
        const duplicate = await request(app).post(path).set(headers).send({ link: "https://example.com/again" });
        expect(duplicate.status).toBe(409);
        expect((await request(app).delete(`/api/assignments/${assignment.id}`).set(auth(tokenFor(director)))).status).toBe(409);
    });

    it("returns 404 for a missing assignment and requires auth", async () => {
        const member = await createMember({ role: "director" });
        expect((await request(app).get("/api/assignments/507f1f77bcf86cd799439011").set(auth(tokenFor(member)))).status).toBe(404);
        expect((await request(app).get("/api/assignments")).status).toBe(401);
    });
});

describe("submissions API", () => {
    it("hashes member passwords and accepts only the matching password", async () => {
        const member = await createMember();
        const stored = await Member.findById(member._id).select("+password");
        expect(stored.password).not.toBe("Password123");
        expect(await stored.comparePassword("Password123")).toBe(true);
        expect(await stored.comparePassword("WrongPassword")).toBe(false);
    });

    it("recalculates isLate when a submission is edited", async () => {
        const director = await createMember({ role: "director" });
        const member = await createMember();
        const song = await createSong();
        const assignment = await createAssignment(song, director);
        const created = await request(app)
            .post(`/api/assignments/${assignment.id}/submissions`)
            .set(auth(tokenFor(member)))
            .send({ link: "https://example.com/recording" });
        expect(created.status).toBe(201);
        expect(created.body.isLate).toBe(false);
        await Assignment.updateOne({ _id: assignment._id }, { deadline: new Date(Date.now() - 1000) });
        const edited = await request(app).put(`/api/submissions/${created.body._id}`)
            .set(auth(tokenFor(member))).send({ note: "Updated after deadline" });
        expect(edited.status).toBe(200);
        expect(edited.body.isLate).toBe(true);
    });

    it("limits edits to the owning member and reports missing or invalid ids", async () => {
        const director = await createMember({ role: "director" });
        const owner = await createMember();
        const other = await createMember();
        const song = await createSong();
        const assignment = await createAssignment(song, director);
        const submission = await Submission.create({
            assignment: assignment._id, member: owner._id, link: "https://example.com/work",
        });
        const url = `/api/submissions/${submission.id}`;
        expect((await request(app).put(url).set(auth(tokenFor(other))).send({ note: "No" })).status).toBe(403);
        expect((await request(app).get("/api/submissions/invalid").set(auth(tokenFor(owner)))).status).toBe(400);
        expect((await request(app).get("/api/submissions/507f1f77bcf86cd799439011").set(auth(tokenFor(owner)))).status).toBe(404);
    });
});
