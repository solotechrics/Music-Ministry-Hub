Week 3 - Oluwasegun Opeyemi Solomon - Backend - Music Ministry Hub

Delivered:
- Automated tests: Jest and Supertest suites that use an isolated in-memory MongoDB, plus a coverage command and report.
- Security basics: Helmet headers, configured CORS, rate limits on login and sign-up, a 100 KB JSON limit, Zod validation on request input, and a startup check for JWT_SECRET.
- Pagination on songs, assignments, my submissions and assignment submissions, with matching API and Postman examples.
- API documentation (OpenAPI), a local setup guide, security and performance notes, and a deployment guide for Render and MongoDB Atlas.

Verification (as reported by the test run on 2026-11-01):
- npm test: 7 suites, 43 tests passed.
- npm run test:coverage: 82.35% statements, 67.83% branches, 87.50% functions, 84.26% lines.
- OpenAPI file: parsed with 12 paths and 21 operations.
- npm audit: 21 findings on 2026-11-01 (3 low, 17 moderate, 1 high). The high one is in body-parser, a production dependency, and has a compatible patch. 20 of the findings are in development tools only.

Links:
- Repository: https://github.com/solotechrics/Music-Ministry-Hub
- Tag: week-3 (the code at commit cfa90ae; the live deployment, video and final documents were completed after the tag)
- Live API URL: [ADD AFTER DEPLOYMENT]
- Video walkthrough: [ADD AFTER RECORDING]
- Drive folder: [ADD LINK]

Blockers / risks: [WRITE WHAT REALLY SLOWED YOU DOWN, FOR EXAMPLE LOCAL MONGODB NOT STARTING AND ATLAS SETUP]. The rate limiter uses process memory. Services and setlists are not built.

AI and sources used: Claude (planning, reviews, documents and parts of the code) and OpenAI Codex (implementing and testing later parts of the project from my prompts). Full details are in the declaration (docs/week-3/declaration.md).
