Week 1 - Oluwasegun Opeyemi Solomon - Backend - Music Ministry Hub

Delivered:
- Idea one-pager: <link to /docs/idea-one-pager.md>
- Work plan: <link to /docs/work-plan.md>
- Task 1.1 ERD and API spec: <link to /docs/data-model-and-api-spec.md and erd.png>
- Task 1.2 Songs CRUD (create, list, get one, update, delete) with validation and seed data: <repo link>, tag week-1
- Sample requests: <link to Postman collection or .http file>

Changed after feedback: Not applicable (Week 1).

Key technical decisions:
- MongoDB with Mongoose: quick to set up, schemas and validation in code. Collections link to each other with ObjectId references; setlist songs are embedded inside the service.
- Submissions use links or notes, not file uploads, to keep the API light.
- Songs chosen as the main entity for Week 1; assignments and submissions follow in Week 2.

Blockers / risks: <write honestly, e.g. time, database setup>

AI and sources used: Claude (AI assistant) was used to refine the idea scope and draft the one-pager, work plan, spec and README templates, which I reviewed and edited. <State here what you used AI for in the code, if anything, and what you changed.>
