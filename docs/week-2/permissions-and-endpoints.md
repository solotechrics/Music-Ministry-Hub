# Permissions and Planned Endpoints (Week 2)

## Roles

- **member:** default role. Created through sign-up.
- **director:** can manage songs and assignments. Never created through sign-up. The seed script creates the director account.

## Rules

- Sign-up always creates a `member`. The `role` field in the request body is ignored.
- Passwords must be at least 8 characters and are stored hashed (bcrypt).
- Not logged in, or invalid token: **401**.
- Logged in but not allowed: **403**.
- Duplicate email, duplicate submission, or deleting a song that still has assignments: **409**.
- A submission after the deadline is accepted but marked late.

## Permission table

| Action                                 | Not logged in | Member                        | Director                         |
| -------------------------------------- | ------------- | ----------------------------- | -------------------------------- |
| Sign up, log in                        | Allowed       | Allowed                       | Allowed                          |
| View songs                             | 401           | Allowed                       | Allowed                          |
| Create, update, delete songs           | 401           | 403                           | Allowed                          |
| View assignments                       | 401           | Allowed                       | Allowed                          |
| Create assignments                     | 401           | 403                           | Allowed                          |
| Update, delete an assignment           | 401           | 403                           | Only the director who created it |
| Submit to an assignment                | 401           | Allowed (once per assignment) | 403                              |
| View own submissions                   | 401           | Allowed                       | Allowed                          |
| Update, delete a submission            | 401           | Only their own                | 403                              |
| View all submissions for an assignment | 401           | 403                           | Allowed                          |

## Planned endpoints

| Method           | Path                             | Access                                         |
| ---------------- | -------------------------------- | ---------------------------------------------- |
| POST             | /api/auth/signup                 | Public                                         |
| POST             | /api/auth/login                  | Public                                         |
| GET              | /api/auth/me                     | Logged in                                      |
| GET, POST        | /api/songs                       | GET: logged in. POST: director                 |
| GET, PUT, DELETE | /api/songs/:id                   | GET: logged in. PUT, DELETE: director          |
| GET              | /api/songs/:id/assignments       | Logged in                                      |
| GET, POST        | /api/assignments                 | GET: logged in. POST: director                 |
| GET, PUT, DELETE | /api/assignments/:id             | GET: logged in. PUT, DELETE: creating director |
| POST             | /api/assignments/:id/submissions | Member                                         |
| GET              | /api/assignments/:id/submissions | Director                                       |
| GET              | /api/submissions/mine            | Member                                         |
| PUT, DELETE      | /api/submissions/:id             | Owning member                                  |
