# Music Ministry Hub

An API for a church music ministry. Directors manage songs, post practice assignments with deadlines, and members submit their work, so rehearsal preparation happens before Sunday.

## Stack

Node.js, Express, MongoDB (Mongoose), Zod

## Status

Week 1: Songs CRUD (create, list, get one, update, delete). Week 2: authentication, assignments, and submissions.

## How to run (local)

1. Install Node.js. Install MongoDB locally, or create a free MongoDB Atlas cluster.
2. Clone the repo and run `npm install`.
3. Copy `.env.example` to `.env` and set `MONGODB_URI` to your own connection string.
4. Seed sample data with `npm run seed`.
5. Start the server with `npm run dev`. The API runs on `http://localhost:3006/api`.

## Endpoints

| Method | Path           | Purpose       |
| ------ | -------------- | ------------- |
| POST   | /api/songs     | Create a song |
| GET    | /api/songs     | List songs    |
| GET    | /api/songs/:id | Get one song  |
| PUT    | /api/songs/:id | Update a song |
| DELETE | /api/songs/:id | Delete a song |
| GET | /api/songs/:id/assignments | List a song's assignments |
| GET, POST | /api/assignments | List or create assignments |
| GET, PUT, DELETE | /api/assignments/:id | Read or manage an assignment |
| POST | /api/assignments/:id/submissions | Submit work for an assignment |
| GET | /api/assignments/:id/submissions | List an assignment's submissions (director) |
| GET | /api/submissions/mine | List the logged-in member's submissions |
| PUT, DELETE | /api/submissions/:id | Update or delete an owned submission |

Full details: `/docs/data-model-and-api-spec.md`

## Docs

- `/docs/idea-one-pager.md`
- `/docs/work-plan.md`
- `/docs/data-model-and-api-spec.md`
- `/docs/erd.dbml` and `erd.png`

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
