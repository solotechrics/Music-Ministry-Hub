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
| Method | Path | Purpose |
| --- | --- | --- |
| POST | /api/songs | Create a song |
| GET | /api/songs | List songs |
| GET | /api/songs/:id | Get one song |
| PUT | /api/songs/:id | Update a song |
| DELETE | /api/songs/:id | Delete a song |

Full details: `/docs/data-model-and-api-spec.md`

## Docs
- `/docs/idea-one-pager.md`
- `/docs/work-plan.md`
- `/docs/data-model-and-api-spec.md`
- `/docs/erd.dbml` and `erd.png`
