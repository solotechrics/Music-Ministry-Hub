# Week 3 technical reflection

## What changed over the three weeks

The project moved from the initial songs API and project setup, through authentication, roles, relationships, validation and conflict handling, into Week 3 testing, security, pagination and deployment preparation. Week 1 established the song CRUD flow. Week 2 added member and director authentication, assignments and submissions, ownership rules, and the API and ERD documentation. Week 3 added isolated database tests and coverage reporting, an `isLate` helper, basic API hardening, paginated list responses with indexes, and deployment and API documentation.

The Week 2 issue log records setup problems with npm scripts, Postman URLs, Mongoose 9 hooks, authorization, duplicate submissions and boundary validation. The Week 3 issue log records the Jest and MongoDB driver failure, the first-run binary download, and dependency audit results.

## What remains risky

- The rate limiter stores its counters in process memory, so it will not coordinate across multiple instances.
- `npm audit` reported 21 findings when it was run, including one high-severity `body-parser` finding in a production dependency. It needs a compatible patch.
- The seed script removes existing records. It is guarded in production, but it must only be used deliberately on an empty database.
- Offset pagination and exact total counts may become expensive as collections grow.
- The live deployment on Atlas and Render must be configured and checked.
- Services and setlists, media uploads, reminders and a frontend are outside the built API.

## What I would do next

1. Finish the Atlas and Render deployment, set the secrets privately, and verify the live API.
2. Patch the audit findings with compatible updates, then rerun the tests and the audit.
3. Replace the in-memory rate-limit store if the API runs on more than one process.
4. Add cursor pagination and monitoring if real usage shows that offset paging or counts are too slow.
5. Plan the services and setlists feature only after confirming that users need it.

## Personal reflection (write these in your own words)

- The most useful thing I learned: **[ADD YOUR EXPERIENCE]**
- A decision I would change or revisit, and why: **[ADD YOUR REASON]**
- The part I found most difficult: **[ADD YOUR EXPERIENCE]**
- The next skill or task I want to focus on: **[ADD YOUR PLAN]**
