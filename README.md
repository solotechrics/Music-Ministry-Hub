# Music Ministry Hub

An API for a church music ministry. Directors manage songs, post practice assignments with deadlines, and members submit their work, so rehearsal preparation happens before Sunday.

## Stack

Node.js, Express, MongoDB (Mongoose)

## Status

Week 1: Songs CRUD (create, list, get one, update, delete). More coming in Weeks 2 and 3.

## How to run (local)

1. Install Node.js. Install MongoDB locally, or create a free MongoDB Atlas cluster.
2. Clone the repo and run `npm install`.
3. Copy `.env.example` to `.env` and set `MONGODB_URI` to your own connection string.
4. Seed sample data with `npm run seed`.
5. Start the server with `npm run dev`. The API runs on `http://localhost:3006/api`.

## Endpoints (Week 1)

| Method | Path           | Purpose       |
| ------ | -------------- | ------------- |
| POST   | /api/songs     | Create a song |
| GET    | /api/songs     | List songs    |
| GET    | /api/songs/:id | Get one song  |
| PUT    | /api/songs/:id | Update a song |
| DELETE | /api/songs/:id | Delete a song |

Full details: `/docs/data-model-and-api-spec.md`

## Docs

- `/docs/idea-one-pager.md`
- `/docs/work-plan.md`
- `/docs/data-model-and-api-spec.md`
- `/docs/erd.dbml` and `erd.png`

## Issue Log week 2

| #   | Issue                                                                                                                                 | What happened                                                                                                                                          | Options considered                              | Fix                                                                       |
| --- | ------------------------------------------------------------------------------------------------------------------------------------- | ------------------------------------------------------------------------------------------------------------------------------------------------------ | ----------------------------------------------- | ------------------------------------------------------------------------- |
| 1   | npm scripts did not run                                                                                                               | `npm run seed` and `npm run dev` failed with "Cannot find module" because the scripts were outside the `scripts` block and pointed to the project root | Move files to the root, or fix the script paths | Moved `dev`, `start` and `seed` into `scripts` and pointed them to `src/` |
| 2   | Invalid JSON in Postman                                                                                                               | A PUT request returned 400 INVALID_JSON because the body had a missing key name and a trailing comma                                                   | Ignore the error, or fix the body               | Fixed the JSON; the error handler returned a clean 400 as designed        |
| 3   | Postman base URL confusion                                                                                                            | `baseUrl` existed in both the collection and the environment, no environment was selected, and the value was missing `/api`                            | Keep both, or keep one                          | Kept one environment variable with `/api` and selected the environment    |
| 4   | Week 1 update note sent with placeholders                                                                                             | The note was submitted before the links and blockers were filled in                                                                                    | Ignore it, or send a correction                 | Sent a corrected update note                                              |
| 5   | Changed all my functions to function expression                                                                                       |
| 6   | Sign-up would crash: the next callback in the pre-save hook is not supported in Mongoose 9. Fixed by using an async hook without next |

| 7 | - Assignments needed an owner check beyond the role check. A second director could edit another director’s assignment. Fixed by comparing `createdBy` with the logged-in director’s id for update and delete operations. |
