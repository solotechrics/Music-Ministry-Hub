# Music Ministry Hub

An API for a church music ministry. Directors manage songs, post practice assignments with deadlines, and members submit their work, so rehearsal preparation happens before Sunday.

## Stack

Node.js, Express, MongoDB (Mongoose), Zod

## Status

Week 1: Songs CRUD (create, list, get one, update, delete). Week 2: authentication, assignments, and submissions.

## Run locally

1. Install Node.js and use a local MongoDB instance or an Atlas database.
2. Run `npm install`.
3. Copy `.env.example` to `.env` and set `MONGODB_URI` to your development database. The JWT values in the example are fake development placeholders; use your own local values when needed.
4. Run `npm run seed` to reset and populate the database.
5. Run `npm run dev`. The API base URL is `http://localhost:3006/api`.

## Seed accounts and authentication

`npm run seed` creates these local test accounts. All four use password `Password123`.

| Role | Email |
| --- | --- |
| Director | `director@example.com` |
| Director | `director2@example.com` |
| Member (chorister) | `member@example.com` |
| Member (instrumentalist) | `member2@example.com` |

Log in with `POST /auth/login` and copy the returned token. Send it on protected requests in the `Authorization` header as `Bearer <token>`.

```bash
curl -X POST http://localhost:3006/api/auth/login \
  -H 'Content-Type: application/json' \
  -d '{"email":"director@example.com","password":"Password123"}'
```

Copy `token` from that response into a local shell variable, then attach it to protected requests:

```bash
TOKEN='<token returned by login>'
curl http://localhost:3006/api/auth/me -H "Authorization: Bearer $TOKEN"
```

## API and test requests

See the [built API spec](docs/data-model-and-api-spec.md) and [permissions table](docs/permissions-and-endpoints.md). The versioned [Postman Collection v2.1](docs/postman/music-ministry-hub.postman_collection.json) includes Auth, Songs, Assignments, and Submissions requests, including expected 401, 403, and 409 failures. Tokens belong in a local Postman environment; never commit them.

All API errors use `{ "error": { "code": "...", "message": "..." } }`.

## Week 2 feedback response

Week 2 addressed feedback around clear access rules and reliable input handling by adding role and owner checks, Zod request validation, duplicate protection, and 409 conflicts when a parent still has child records. Services and setlists are marked as planned for later.

## Docs

- `/docs/idea-one-pager.md`
- `/docs/work-plan.md`
- `/docs/data-model-and-api-spec.md`
- `/docs/erd.dbml` and `erd.png`
- `/docs/permissions-and-endpoints.md`
- `/docs/postman/music-ministry-hub.postman_collection.json`

[Issue log (Week 2)](docs/week-2/issue-log.md)

## Issue Log week 2

| # | Issue | What happened | Fix |
| --- | --- | --- | --- |
| 1 | npm scripts did not run | `npm run seed` and `npm run dev` could not find their entry points. | Pointed the scripts to files in `src/`. |
| 2 | Invalid JSON in Postman | A PUT body had a missing key name and trailing comma. | Fixed the JSON; the error handler returned 400 as designed. |
| 3 | Postman base URL confusion | The environment was not selected and `baseUrl` lacked `/api`. | Selected the correct environment and set `baseUrl` to include `/api`. |
| 4 | Week 1 update note contained placeholders | The note was submitted before the links and blockers were filled in. | Sent a corrected update note. |
| 5 | Mongoose 9 sign-up hook error | The next callback in a pre-save hook was unsupported. | Replaced it with an async hook without `next`. |
| 6 | Assignment ownership | A second director could edit another director’s assignment. | Checked that `createdBy` matches the logged-in director for update and delete. |
| 7 | Duplicate submissions | A member could submit twice to the same assignment. | Added a unique index on `assignment` and `member`; the error handler returns 409. |
| 8 | Input was validated only by Mongoose. Added Zod schemas at the API boundary on every input, so bad requests are rejected early, and unknown fields are dropped. | Validation previously happened at the database layer. | Added Zod validation middleware before route handlers. |
| 9 | Deleting a song or assignment would leave orphaned assignments or submissions. | Parent records could be removed while child records still referenced them. | Now returns 409 if children exist; ownership is checked before the conflict check, so non-owners get 403. |
