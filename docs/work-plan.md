# Work Plan: Music Ministry Hub

## Week 1: Design and build
- Idea one-pager, work plan, public repo with README and .env.example
- Task 1.1: ERD and API spec (/docs)
- Task 1.2: CRUD endpoints for Songs with validation, correct status codes, seed data and sample requests
- 5-minute presentation to mentors
- Tag: week-1

## Week 2: Auth and robustness
- Respond to Week 1 feedback; start the issue log (aim for 5 or more entries)
- Task 2.1: Sign-up and login (JWT, bcrypt), protected routes, roles (director, member), ownership checks, 401 and 403
- Task 2.2: Members, Services and setlists, Assignments, Submissions with relationships; schema validation on every input; one error format; global error handler; edge cases (duplicates, deleting a parent with children, invalid IDs)
- Tag: week-2

## Week 3: Quality and delivery
- Task 3.1: Unit and integration tests (including 400, 401, 403, 404), one command to run, coverage note
- Task 3.2: API docs, security basics (env secrets, CORS, rate limit on auth), pagination and indexes, deploy, setup guide, security and performance notes
- Final package: case study, walkthrough video, reflection, declaration
- Tag: week-3

## Top 3 risks
1. **Scope too big for part-time work.** Build in this order: Songs, Auth, Assignments, Submissions, Services. If late, drop service ordering first.
2. **Permission mistakes.** Write a table of who can do what (director, member, owner) before coding Week 2.
3. **Deployment trouble on a free host.** Use MongoDB Atlas (free tier) for the hosted database, deploy early in Week 3, note any sleep delay in the README, keep local run steps as backup.
