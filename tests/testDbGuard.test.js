const { connectTestDB } = require("./helpers");

describe("test database safety guard", () => {
    const original = process.env.MONGODB_URI_TEST;

    afterEach(() => {
        process.env.MONGODB_URI_TEST = original;
    });

    it("refuses to run when MONGODB_URI_TEST is missing", async () => {
        delete process.env.MONGODB_URI_TEST;
        await expect(connectTestDB()).rejects.toThrow("MONGODB_URI_TEST is missing");
    });

    it("refuses a database name that does not end with _test", async () => {
        process.env.MONGODB_URI_TEST = "mongodb://127.0.0.1:27017/music_ministry_hub";
        await expect(connectTestDB()).rejects.toThrow("must end with _test");
    });

    it("also catches a real database name with connection options", async () => {
        process.env.MONGODB_URI_TEST = "mongodb+srv://user:pass@cluster.example.net/music_ministry_hub?retryWrites=true";
        await expect(connectTestDB()).rejects.toThrow("must end with _test");
    });
});
