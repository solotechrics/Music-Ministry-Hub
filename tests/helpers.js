require("dotenv").config({ quiet: true });
process.env.JWT_SECRET = process.env.JWT_SECRET || "test-secret";

const mongoose = require("mongoose");
const os = require("os");
const { MongoMemoryServer } = require("mongodb-memory-server");
let mongoServer;
const DB_STARTUP_TIMEOUT_MS = 10 * 60 * 1000;

const connectTestDB = async function () {
    mongoServer = await MongoMemoryServer.create({ instance: { ip: "127.0.0.1" } });
    await mongoose.connect(mongoServer.getUri(), {
        dbName: "music_ministry_test",
        serverSelectionTimeoutMS: 3000,
        // Workaround for NODE-7832 in Jest; remove once the MongoDB driver is fixed.
        runtimeAdapters: { os },
    });

    await Promise.all(
        Object.values(mongoose.models).map((model) => model.init()),
    );
};

const clearDB = async function () {
    const collections = mongoose.connection.collections;
    for (const name of Object.keys(collections)) {
        await collections[name].deleteMany({});
    }
};

const closeDB = async function () {
    await mongoose.disconnect();
    if (mongoServer) {
        await mongoServer.stop();
        mongoServer = undefined;
    }
};

module.exports = { connectTestDB, clearDB, closeDB, DB_STARTUP_TIMEOUT_MS };
