# Data Model and API Spec (Task 1.1)

Database: MongoDB (Mongoose). ERD: see `erd.png` (generated from `erd.dbml` on dbdiagram.io). Every document has an `_id` (ObjectId) created by MongoDB. JSON field names use camelCase.

## Collections and key fields

**members**
| Field | Type | Notes |
| --- | --- | --- |
| _id | ObjectId | |
| fullName | String | required, max 100 |
| email | String | required, unique |
| password | String | required, hashed and hidden from JSON responses |
| role | String enum: director, member | default member |
| memberType | String enum: chorister, instrumentalist | required |
| part | String | voice part or instrument, e.g. alto, keyboard |
| createdAt | Date | |

**songs**
| Field | Type | Notes |
| --- | --- | --- |
| _id | ObjectId | |
| title | String | required, 1 to 120 characters |
| composer | String | optional |
| musicalKey | String | required, e.g. C, F#, Bbm |
| tempoBpm | Number | optional, whole number 30 to 240 |
| referenceLink | String | optional, valid URL |
| notes | String | optional |
| createdAt, updatedAt | Date | automatic timestamps |

**services (not built; planned for later)**
| Field | Type | Notes |
| --- | --- | --- |
| _id | ObjectId | |
| serviceDate | Date | required |
| title | String | e.g. Sunday First Service |
| notes | String | optional |
| songs | Array of { song: ObjectId (ref songs), position: Number } | the ordered setlist, embedded |

**assignments**
| Field | Type | Notes |
| --- | --- | --- |
| _id | ObjectId | |
| song | ObjectId, ref songs | required |
| createdBy | ObjectId, ref members | the director |
| title | String | required |
| type | String enum: sight_singing, sight_reading, by_ear | required |
| audience | String enum: choristers, instrumentalists, all | required |
| instructions | String | required |
| tutorialLink | String | optional |
| deadline | Date | required |
| createdAt | Date | |

**submissions**
| Field | Type | Notes |
| --- | --- | --- |
| _id | ObjectId | |
| assignment | ObjectId, ref assignments | required |
| member | ObjectId, ref members | required |
| link | String | link to recording or photo of paper work |
| note | String | optional |
| isLate | Boolean | set by the server based on the assignment deadline; default false |
| createdAt, updatedAt | Date | automatic timestamps; `createdAt` is the submission time |

Unique index: `{ assignment, member }`, so a member can create one submission per assignment. A repeated create returns 409; an existing submission can be edited with PUT.

## Relationships
- A song has many assignments (one-to-many, reference)
- A director (member) creates many assignments (one-to-many, reference)
- An assignment has many submissions (one-to-many, reference)
- A member has many submissions (one-to-many, reference)
- Services and songs are many-to-many: each service embeds an ordered list of song references

## Design decisions
- **MongoDB with Mongoose:** quick to set up, and Mongoose schemas give required fields, enums and validation in code.
- **References for assignments and submissions:** they grow over time and are queried on their own, so they live in separate collections linked by ObjectId.
- **Setlist embedded in the service:** a setlist is small and always read with its service, so one document is simpler than a join collection.
- **Links, not file uploads:** submissions store a link (Drive, YouTube) or a note. This keeps the API light and avoids file storage.
- **Enums for role, type and audience:** limits values to known options and makes validation simple.
- **One submission per member per assignment:** enforced by a unique index; a repeated create returns 409 and an existing submission can be edited with PUT.
- **musicalKey as validated text:** keys follow a fixed pattern (letter A-G, optional # or b, optional m for minor).

## Built API endpoints

Base path: `/api`. `:id` is a MongoDB ObjectId (24 hexadecimal characters).

| Method | Path | Access | Request body | Success | Errors |
| ------ | ---------------------------- | ---------------------- | ---------------------------------------------------------------------------- | -------------------- | ---------------------------------------------- |
| GET | /health | Public | none | 200 | none |
| POST | /auth/signup | Public | fullName, email, password, memberType, part (optional) | 201 member | 400, 409 |
| POST | /auth/login | Public | email, password | 200 token and member | 400, 401 |
| GET | /auth/me | Logged in | none | 200 member | 401 |
| GET | /songs | Logged in | none | 200 | 401 |
| POST | /songs | Director | title, musicalKey, plus optional fields | 201 | 400, 401, 403 |
| GET | /songs/:id | Logged in | none | 200 | 400, 401, 404 |
| PUT | /songs/:id | Director | title, musicalKey, plus optional fields | 200 | 400, 401, 403, 404 |
| DELETE | /songs/:id | Director | none | 200 | 400, 401, 403, 404, 409 (song has assignments) |
| GET | /songs/:id/assignments | Logged in | none | 200 | 400, 401, 404 |
| GET | /assignments | Logged in | none | 200 | 401 |
| POST | /assignments | Director | song, title, type, audience, instructions, deadline, tutorialLink (optional) | 201 | 400, 401, 403, 404 (song missing) |
| GET | /assignments/:id | Logged in | none | 200 | 400, 401, 404 |
| PUT | /assignments/:id | Creating director | any of title, type, audience, instructions, tutorialLink, deadline | 200 | 400, 401, 403, 404 |
| DELETE | /assignments/:id | Creating director | none | 200 | 400, 401, 403, 404, 409 (has submissions) |
| POST | /assignments/:id/submissions | Member in the audience | link, note (optional) | 201 | 400, 401, 403, 404, 409 (already submitted) |
| GET | /assignments/:id/submissions | Director | none | 200 | 400, 401, 403, 404 |
| GET | /submissions/mine | Member | none | 200 | 401, 403 |
| GET | /submissions/:id | Owning member | none | 200 | 400, 401, 403, 404 |
| PUT | /submissions/:id | Owning member | link, note | 200 | 400, 401, 403, 404 |
| DELETE | /submissions/:id | Owning member | none | 200 | 400, 401, 403, 404 |

Services and setlists endpoints: **Not built. Planned for later.**

Errors use the shape `{ "error": { "code": "...", "message": "..." } }`.

Duplicate member email and duplicate member/assignment submissions return 409. Deleting a song that has assignments or an assignment that has submissions also returns 409. Request bodies are validated with Zod at the API boundary and Mongoose at the model layer.
