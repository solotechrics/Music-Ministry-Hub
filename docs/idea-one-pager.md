# Music Ministry Hub

**Track:** Backend Development
**Stack:** Node.js, Express, MongoDB (Mongoose)
**Target user:** Directors and members (choristers and instrumentalists) of a church music ministry.

**Problem:** Songs, keys, rehearsal plans and practice tasks are shared in chat groups, so details get lost and members only start learning a song on rehearsal day. Directors cannot easily see who has practised and who has not.

**Entities:** Members, Songs, Services (with an ordered setlist), Assignments, Submissions

**Core flow:** Director adds a song -> Director posts an assignment on that song (type, tutorial link, deadline, audience) -> Member submits a link or note before the deadline -> Director views who has submitted and who is late.

**In scope:**
- Song library (title, key, tempo, reference link)
- Assignments with type (sight singing, sight reading, by ear), tutorial and deadline
- Submissions by link or short note, one per member per assignment
- Sunday service setlists (ordered songs)
- Two roles: director and member

**Out of scope:**
- Real-time chat or live messaging
- File uploads (links to Drive or YouTube only)
- Payments or giving
- Push notifications or email reminders
- Frontend interface (API only)

**Top 3 risks:**
1. Scope is too big for part-time work. Mitigation: build Songs first, then Assignments and Submissions, and drop service ordering if time runs short.
2. Permission mistakes (director vs member vs owner of a submission). Mitigation: write a permission table before coding Week 2.
3. Deployment problems on a free host. Mitigation: deploy early in Week 3 and keep clear local run steps as backup.
