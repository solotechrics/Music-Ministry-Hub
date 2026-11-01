# Week 3 Test Coverage Note

## What the tests cover

- Zod schemas accept valid signup, song, assignment and submission inputs and reject invalid examples.
- Authentication rejects missing and invalid bearer tokens, looks up the member for a valid token, and authorization distinguishes allowed and denied roles.
- `isLate` is checked before, exactly at, and after the deadline.
- API tests cover signup/login (including a NoSQL selector body), song creation and pagination, assignment creation and ownership, audience restrictions, duplicate submissions, parent deletion conflicts, invalid ids, and recalculating `isLate` after editing.
- Security tests cover Helmet and CORS headers, auth rate limiting, oversized JSON bodies, and generic 500 responses with no stack traces.
- The member password hash and `comparePassword` behavior is covered by a database-backed test.

## What was executed

The complete plain `npm test` command passed with no `MONGOMS_*` environment variables set: **7 suites, 42 tests**. The same command passed in a fresh clone after `npm ci` and copying `.env.example` to `.env`.

The complete `npm run test:coverage` suite also passed: **7 suites, 42 tests**. Overall measured coverage was **82.35% statements, 67.83% branches, 87.50% functions, and 84.26% lines**. The runs used the default in-memory MongoDB binary, version **7.0.24**.

On the first run, `mongodb-memory-server` downloads its default MongoDB binary and needs internet access. If MongoDB is already installed, set `MONGOMS_SYSTEM_BINARY` to the local `mongod` executable path for the command. The repository does not contain a machine-specific binary path. Tests always use the in-memory database; `MONGODB_URI_TEST` is not used.

## What remains uncovered

Coverage is not 100%. The report shows no coverage for `src/config/db.js` because the test suite does not exercise production database startup. Some model validators and route error paths also remain uncovered; the exact uncovered lines are in Jest's generated coverage report.

The former Jest connection failure was caused by MongoDB Node driver 7.6+ runtime adapter resolution under Jest, not by the API tests or an unsupported MongoDB server version. Passing `runtimeAdapters: { os: require("os") }` to the Mongoose connection fixed it. The focused connection regression test and the full in-memory API suite pass with that option.
