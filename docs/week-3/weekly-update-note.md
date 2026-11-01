# Week 3 update — DRAFT

**Name:** [CONFIRM YOUR NAME]  
**Track:** Backend Development  
**Project:** Music Ministry Hub

## Delivered

- Database-backed Jest/Supertest suites using an isolated in-memory MongoDB, plus a coverage command and report.
- Security basics: Helmet headers, configured CORS, login/signup rate limits, a 100 KB JSON limit, Zod-bound request validation, and startup checks for `JWT_SECRET`.
- Pagination on songs, assignments, my submissions, and assignment submissions, with matching API and Postman examples.
- Render/Atlas deployment instructions, OpenAPI specification, local setup guide, and draft reflection/declaration/video materials.

## Verification

- `npm test`: **7 suites, 42 tests passed**; also passed from a fresh clone after `npm ci` and copying `.env.example` to `.env`.
- `npm run test:coverage`: **7 suites, 42 tests passed**; 82.35% statements, 67.83% branches, 87.50% functions, and 84.26% lines.
- OpenAPI YAML parse: passed with 12 paths, 21 operations, and all local references resolving.
- `npm audit`: 21 findings were reported on 2026-11-01 (3 low, 17 moderate, 1 high); re-run before submission in case registry advisories changed.

## Links to complete

- Live API URL: **[ADD AFTER DEPLOYMENT]**
- Video walkthrough: **[ADD AFTER RECORDING]**
- Repository/commit link: **[ADD AFTER PUSHING, IF REQUIRED]**

## Still to do

Create Atlas and Render resources, set private environment values, deploy, seed only an empty database, verify the deployed API, record the walkthrough, and review the declaration/reflection so all personal claims are accurate.
