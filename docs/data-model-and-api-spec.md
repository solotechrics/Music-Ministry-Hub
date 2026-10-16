# Data Model and API Spec (Task 1.1)

Database: MongoDB (Mongoose). ERD: see `erd.png` (generated from `erd.dbml` on dbdiagram.io). Every document has an `_id` (ObjectId) created by MongoDB. JSON field names use camelCase.

## Collections and key fields

**members**
| Field | Type | Notes |
| --- | --- | --- |
| _id | ObjectId | |
| fullName | String | required, max 100 |
| email | String | required, unique |
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

**services**
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
| submittedAt | Date | used to flag late work |

Unique index: `{ assignment, member }`, so one submission per member per assignment.

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
- **One submission per member per assignment:** enforced by a unique index; a resubmission updates the existing one.
- **musicalKey as validated text:** keys follow a fixed pattern (letter A-G, optional # or b, optional m for minor).

## Week 1 endpoints: Songs (built and tested this week)

Base path: `/api`. `:id` is a MongoDB ObjectId (24 hex characters).

| Method | Path | Purpose | Request body | Success response | Errors |
| --- | --- | --- | --- | --- | --- |
| POST | /songs | Create a song | title, musicalKey (required); composer, tempoBpm, referenceLink, notes | 201 + created song | 400 invalid input |
| GET | /songs | List all songs | none | 200 + array of songs | none |
| GET | /songs/:id | Get one song | none | 200 + song | 400 invalid id, 404 not found |
| PUT | /songs/:id | Update a song | same fields as create | 200 + updated song | 400 invalid input or id, 404 not found |
| DELETE | /songs/:id | Delete a song | none | 200 + `{ "message": "Song deleted" }` | 400 invalid id, 404 not found |

Validation rules (songs):
- title: required, 1 to 120 characters
- musicalKey: required, pattern letter A-G, optional # or b, optional m
- tempoBpm: optional, whole number from 30 to 240
- referenceLink: optional, must be a valid URL

## Planned endpoints (not built yet)
- Week 2: auth (sign-up, login), members, services and setlists, assignments, submissions
- Details will be added to this spec when each is built.
