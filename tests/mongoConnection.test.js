"use strict";

const mongoose = require("mongoose");
const os = require("os");
const { MongoMemoryServer } = require("mongodb-memory-server");

it("connects Mongoose to one in-memory MongoDB instance", async () => {
    const server = await MongoMemoryServer.create({ instance: { ip: "127.0.0.1" } });
    try {
        await mongoose.connect(server.getUri(), {
            dbName: "jest_connection_repro_test",
            serverSelectionTimeoutMS: 3000,
            runtimeAdapters: { os },
        });
        expect(mongoose.connection.readyState).toBe(1);
    } finally {
        await mongoose.disconnect();
        await server.stop();
    }
}, 10 * 60 * 1000);
