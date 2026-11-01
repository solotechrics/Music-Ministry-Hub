"use strict";

const mongoose = require("mongoose");
const { connectTestDB, closeDB, DB_STARTUP_TIMEOUT_MS } = require("./helpers");

describe("in-memory test database", () => {
    const originalUri = process.env.MONGODB_URI_TEST;

    afterEach(async () => {
        await closeDB();
        if (originalUri === undefined) {
            delete process.env.MONGODB_URI_TEST;
        } else {
            process.env.MONGODB_URI_TEST = originalUri;
        }
    });

    const expectInMemoryDatabase = async () => {
        await connectTestDB();
        expect(mongoose.connection.name).toBe("music_ministry_test");
        expect(mongoose.connection.host).toBe("127.0.0.1");
    };

    it("uses an isolated database when MONGODB_URI_TEST is missing", async () => {
        delete process.env.MONGODB_URI_TEST;
        await expectInMemoryDatabase();
    }, DB_STARTUP_TIMEOUT_MS);

    it("does not connect to a non-test MongoDB URI", async () => {
        process.env.MONGODB_URI_TEST = "mongodb://127.0.0.1:27017/music_ministry_hub";
        await expectInMemoryDatabase();
    }, DB_STARTUP_TIMEOUT_MS);

    it("does not connect to an SRV URI with connection options", async () => {
        process.env.MONGODB_URI_TEST =
            "mongodb+srv://user:pass@cluster.example.net/music_ministry_hub?retryWrites=true";
        await expectInMemoryDatabase();
    }, DB_STARTUP_TIMEOUT_MS);
});
