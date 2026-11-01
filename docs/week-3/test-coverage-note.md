# Week 3 Test Coverage Note

## What the tests cover

- Zod schemas accept valid signup, song, assignment and submission inputs and reject invalid examples.
- Authentication rejects missing and invalid bearer tokens, looks up the member for a valid token, and authorization distinguishes allowed and denied roles.
- `isLate` is checked before, exactly at, and after the deadline.
- API tests are written for signup/login, song creation and validation, assignment creation and ownership, audience restrictions, duplicate submissions, parent deletion conflicts, invalid and missing ids, and recalculating `isLate` after editing.
- The member password hash and `comparePassword` behavior is covered by a database-backed test.

## What was executed

The complete `npm test` suite passed: **6 suites, 35 tests**.

The complete `npm run test:coverage` suite also passed: **6 suites, 35 tests**. Overall measured coverage was **76.92% statements, 63.49% branches, 78.94% functions, and 78.85% lines**. Both commands were run with `MONGOMS_SYSTEM_BINARY` pointing to the locally installed MongoDB 8.0.32 executable, so `mongodb-memory-server` used that binary for its isolated database.

On a first run without `MONGOMS_*` settings, `mongodb-memory-server` downloads its default MongoDB binary and needs internet access. If MongoDB is already installed, set `MONGOMS_SYSTEM_BINARY` to the local `mongod` executable path for the command. The repository does not contain a machine-specific binary path.

## What remains uncovered

Coverage is not 100%. The report shows no coverage for `src/config/db.js` because the test suite does not exercise production database startup. Some model validators and route error paths also remain uncovered; the exact uncovered lines are in Jest's generated coverage report.

The former Jest connection failure was caused by MongoDB Node driver 7.6+ runtime adapter resolution under Jest, not by the API tests or an unsupported MongoDB server version. Passing `runtimeAdapters: { os: require("os") }` to the Mongoose connection fixed it. The focused reproduction and database helper test pass with that option, and the full in-memory API suite passes as well.
