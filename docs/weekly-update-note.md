Week 1 - Backend - Music Ministry Hub

Delivered:
- Idea one-pager and work plan: /docs in the repo
- Task 1.1 ERD and API spec: /docs/data-model-and-api-spec.md and /docs/erd.png
- Task 1.2 Songs CRUD (create, list, get one, update, delete) with validation, error handling and seed data: https://github.com/solotechrics/Music-Ministry-Hub, tag week-1
- Sample requests: requests.http in the repo root
- Drive folder: [[Drive link](https://drive.google.com/drive/folders/1f7mEpJ8Sfc-eHmBhHJoXYLzWrrRdNCsR?usp=drive_link)]

Changed after feedback: Not applicable (Week 1).

Key technical decisions:
- MongoDB with Mongoose. Collections link with ObjectId references; setlist songs are embedded inside the service.
- Submissions use links or notes, not file uploads, to keep the API light.
- Songs is the main entity for Week 1; assignments and submissions follow in Week 2.

Blockers / risks: [Blockers / risks: I started Week 1 late, so I had limited time to test. I also spent time on database setup and fixing project scripts. Main risk for Week 2 is the size of the scope (auth, assignments, submissions) while still learning backend. I plan to build in priority order and ask mentors for help early.]

AI and sources used: Claude (AI assistant) was used to refine the idea scope, plan the entities and folder structure, draft the documents, and write the Songs CRUD code (model, routes, error handling, seed script). I reviewed the code and [tested it / am still testing it].