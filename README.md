# Music Ministry Hub

Music Ministry Hub is a REST API for church music directors and members. It organizes a shared song library, practice assignments, and member submissions so rehearsal work is easier to plan and follow up.

## Case study

### Problem

Songs, keys, and practice requests were shared in chat, where details could get lost. Directors also needed a clearer way to see who had submitted work and whether it arrived after an assignment deadline.

### Data model

The API stores members, songs, assignments, and submissions in MongoDB. Assignments reference songs and their creating director; submissions reference one member and one assignment. A unique index allows one submission per member for an assignment. Services and setlists remain planned work.

### Architecture

Express 5 handles HTTP routes. Zod validates request bodies and pagination parameters before route logic; Mongoose models define persisted records and indexes. JWT bearer tokens protect private routes. Helmet, explicit CORS settings, JSON size limits, and auth rate limits provide basic API protections. Jest and Supertest exercise the HTTP API against isolated in-memory MongoDB instances.

### Key decisions

- Keep assignments and submissions in separate collections because each has its own lifecycle and queries.
- Store recording links and notes instead of uploading media.
- Check authorization and record ownership in route handlers.
- Paginate the four growing list endpoints with a default page size of 20 and a maximum of 100.
- Prevent parent deletion while related records exist instead of silently cascading deletes.

### Limitations

Services/setlists, file uploads, notifications, and a frontend are not implemented. Rate limiting uses an in-process memory store, so it does not coordinate across multiple service instances. Pagination uses offset/limit and exact counts. Free Render services sleep when idle. Review the dependency audit and replace demo accounts before production use.

## Run locally

Install Node.js and npm, install packages, copy `.env.example` to `.env`, configure `MONGODB_URI` and a private `JWT_SECRET`, and start MongoDB. See the [local setup guide](docs/setup-guide.md) for the full walkthrough.

```sh
npm ci
npm run seed
npm start
```

The seed script deletes the existing songs, members, assignments, and submissions in its target database. Use it only with a new or disposable database. `GET http://localhost:3006/api/health` returns `{ "status": "ok" }`.

## Run tests

```sh
npm test
npm run test:coverage
```

The tests use an isolated in-memory MongoDB and do not connect to the local or production database. On the first test run, `mongodb-memory-server` downloads a MongoDB binary and needs internet access. If MongoDB is installed already, use `MONGOMS_SYSTEM_BINARY=/path/to/mongod npm test` with your own executable path. No machine-specific path is stored in the repository.

## API and project documents

- [OpenAPI 3.1 specification](docs/openapi.yaml)
- [Data model and endpoint table](docs/data-model-and-api-spec.md)
- [Permissions and built endpoints](docs/permissions-and-endpoints.md)
- [Postman collection](docs/postman/music-ministry-hub.postman_collection.json)
- [Postman environment template](docs/postman/music-ministry-hub.template.postman_environment.json)
- [Security notes and audit findings](docs/security-notes.md)
- [Performance and indexes](docs/performance-notes.md)
- [Render and Atlas deployment guide](docs/deployment-guide.md)
- [Week 3 test coverage note](docs/week-3/test-coverage-note.md)
- [Week 3 issue log draft](docs/week-3/issue-log.md)
- [Week 3 technical reflection draft](docs/week-3/technical-reflection.md)
- [Week 3 declaration draft](docs/week-3/declaration.md)
- [Week 3 walkthrough script](docs/week-3/walkthrough-script.md)
- [Week 3 weekly update draft](docs/week-3/weekly-update-note.md)
- [Week 2 issue log](docs/week-2/issue-log.md)
- [Archived Week 2 issue-log copy](<docs/week-2/issue-log copy.md>)
- [Week 2 weekly update](docs/week-2/weekly-update-note.md)
- [Week 1–3 work plan](docs/work-plan.md)
- [Project one-pager](docs/idea-one-pager.md)
- [ERD source](docs/erd.dbml) and [ERD image](docs/erd.png)
- [Earlier weekly update](docs/weekly-update-note.md)
