require("dotenv").config({ quiet: true });
process.env.JWT_SECRET = process.env.JWT_SECRET || "test-secret";

const mongoose = require("mongoose");

const connectTestDB = async function () {
    const uri = process.env.MONGODB_URI_TEST;

    if (!uri) {
        throw new Error(
            "MONGODB_URI_TEST is missing. Add it to your .env file.",
        );
    }

    const dbName = uri.split("/").pop().split("?")[0];
    if (!dbName.endsWith("_test")) {
        throw new Error(
            `Refusing to run tests on "${dbName}". The test database name must end with _test.`,
        );
    }

      try {
          await mongoose.connect(uri, { serverSelectionTimeoutMS: 3000 });
      } catch (error) {
          throw new Error(
              `Could not connect to the test database. Is MongoDB running? (${error.message})`,
          );
      }

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
    await mongoose.connection.close();
};

module.exports = { connectTestDB, clearDB, closeDB };
