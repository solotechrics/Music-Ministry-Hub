# Permissions and Built Endpoints

## Roles

- **Member:** default role created through sign-up.
- **Director:** can manage songs and create assignments. Sign-up cannot set this role; the seed creates the director accounts.

## Rules

- Sign-up always creates a member. A submitted `role` field is dropped.
- Passwords are hashed with bcrypt and omitted from JSON responses.
- Missing or invalid authentication returns **401**. Authenticated users without permission receive **403**.
- Duplicate email, duplicate submission, deleting a song with assignments, and deleting an assignment with submissions return **409**.
- Members can submit only to assignments for their group (`choristers`, `instrumentalists`, or `all`).
- A submission after its deadline is accepted and marked late. Editing it recomputes `isLate`.
- Assignment updates/deletes are limited to the creating director. Submission reads/updates/deletes are limited to the owning member, except assignment submission lists, which directors can view.

## Built endpoints

| Method | Path | Access |
| --- | --- | --- |
| GET | `/api/health` | Public |
| POST | `/api/auth/signup` | Public |
| POST | `/api/auth/login` | Public |
| GET | `/api/auth/me` | Logged in |
| GET | `/api/songs` | Logged in |
| POST | `/api/songs` | Director |
| GET | `/api/songs/:id` | Logged in |
| PUT, DELETE | `/api/songs/:id` | Director |
| GET | `/api/songs/:id/assignments` | Logged in |
| GET | `/api/assignments` | Logged in |
| POST | `/api/assignments` | Director |
| GET | `/api/assignments/:id` | Logged in |
| PUT, DELETE | `/api/assignments/:id` | Creating director |
| POST | `/api/assignments/:id/submissions` | Member in the audience |
| GET | `/api/assignments/:id/submissions` | Director |
| GET | `/api/submissions/mine` | Member |
| GET | `/api/submissions/:id` | Owning member |
| PUT, DELETE | `/api/submissions/:id` | Owning member |

Services and setlists: **Not built. Planned for later.**
