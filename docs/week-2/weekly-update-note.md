Week 2 - Oluwasegun Opeyemi Solomon - Backend - Music Ministry Hub

Delivered:
- Task 2.1 Auth: sign-up and login (JWT, bcrypt), protected routes, director and member roles, ownership checks, 401 and 403 responses: https://github.com/solotechrics/Music-Ministry-Hub, tag week-2
- Task 2.2 Relationships, validation and errors: assignments and submissions linked to songs and members; related-data endpoints; Zod validation on every input; one error format; 409 conflict handling
- Feedback response and issue log (9 entries): README and docs/week-2/issue-log.md
- Updated Postman collection (33 requests, including 401, 403 and 409 cases): docs/postman/music-ministry-hub.postman_collection.json
- Updated spec, permissions table and ERD: docs/data-model-and-api-spec.md, docs/permissions-and-endpoints.md, docs/erd.png

Changed after feedback: No written mentor feedback received yet. Work followed the Week 1 work plan.

Key technical decisions:
- Role is read from the database on each request, not trusted from the token.
- Ownership is checked before conflict checks, so non-owners get 403.
- Deleting a parent that has children returns 409 instead of cascading.
- Submissions are unique per member and assignment, enforced by a unique index.
- Sign-up always creates a member; the role field is dropped. Directors come from the seed script.
- Submissions store links or notes, not file uploads.

Blockers / risks: Setup issues slowed progress (npm script paths, Postman base URL, and a Mongoose 9 pre-save hook change), all recorded in the issue log. Services and setlists are not built; they were not required this week and are planned for later. The API runs locally with a run guide in the README; it is not deployed yet.

AI and sources used: Claude (planning, code reviews, and drafting documents and parts of the code) and OpenAI Codex (implementing and testing routes, validation, seed data and documentation updates). I reviewed and tested the code. Libraries: Express, Mongoose, bcryptjs, jsonwebtoken, Zod.
