# Week 3 technical reflection — DRAFT

> Review this draft against your own experience before submitting. Replace bracketed prompts with details you can personally confirm.

## What changed over the three weeks

The commit history shows the project moving from the initial songs API and project setup, through authentication, roles, relationships, validation, and conflict handling, into Week 3 testing, security, pagination, and deployment preparation. Week 1 established the song CRUD flow. Week 2 added member/director authentication, assignments and submissions, ownership rules, and the API/ERD documentation. Week 3 added isolated database tests and coverage reporting, an `isLate` helper, basic API hardening, paginated list responses with indexes, and deployment and API documentation.

The Week 2 issue log records setup problems with npm scripts, Postman URLs, Mongoose 9 hooks, authorization, duplicate submissions, and boundary validation. The Week 3 issue log records the Jest/MongoDB driver failure, the first-run binary download, and dependency audit results.

## What remains risky

- The rate limiter stores its counters in process memory; it will not coordinate across multiple instances.
- `npm audit` reported 21 findings at the time it was run, including one high-severity transitive `body-parser` finding.
- The seed script removes existing records. It is guarded in production, but it must only be used deliberately with an empty database.
- Offset pagination and exact total counts may become expensive as collections grow.
- Atlas network access, Render environment settings, and a live deployment still need to be configured and checked by the project owner.
- Services/setlists, media uploads, reminders, and a frontend remain outside the built API.

## What I would do next

1. Create the Atlas and Render resources, set secrets privately, deploy, and verify the live API.
2. Review and patch the audit findings with compatible dependency updates, then rerun the suite and audit.
3. Replace the in-memory rate-limit store if the API is scaled to multiple processes.
4. Add cursor pagination and operational monitoring if real usage shows that offset paging or counts are too slow.
5. Plan the service/setlist feature only after confirming it is still needed by users.

## Personal reflection — fill in

- The most useful thing I learned: **[ADD YOUR EXPERIENCE]**
- A decision I would change or revisit: **[ADD YOUR REASON]**
- The part I personally found most difficult: **[ADD YOUR EXPERIENCE]**
- The next skill or task I want to focus on: **[ADD YOUR PLAN]**
