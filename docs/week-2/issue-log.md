# Week 2 Issue Log

| # | Issue | What happened | Fix |
| --- | --- | --- | --- |
| 1 | npm scripts did not run | `npm run seed` and `npm run dev` could not find their entry points. | Pointed the scripts to files in `src/`. |
| 2 | Invalid JSON in Postman | A PUT body had a missing key name and trailing comma. | Fixed the JSON; the error handler returned 400 as designed. |
| 3 | Postman base URL confusion | The environment was not selected and `baseUrl` lacked `/api`. | Selected the correct environment and set `baseUrl` to include `/api`. |
| 4 | Week 1 update note contained placeholders | The note was submitted before the links and blockers were filled in. | Sent a corrected update note. |
| 5 | Mongoose 9 sign-up hook error | The next callback in a pre-save hook was unsupported. | Replaced it with an async hook without `next`. |
| 6 | Assignment ownership | A second director could edit another director’s assignment. | Checked that `createdBy` matches the logged-in director for update and delete. |
| 7 | Duplicate submissions | A member could submit twice to the same assignment. | Added a unique index on `assignment` and `member`; the error handler returns 409. |
| 8 | Input was validated only by Mongoose | Validation previously happened at the database layer. | Added Zod schemas at the API boundary on every input, so bad requests are rejected early and unknown fields are dropped. |
| 9 | Parent deletion could leave orphaned records | A song or assignment could be removed while child records still referenced it. | Deletion now returns 409 if children exist; ownership is checked before the conflict check, so non-owners get 403. |
