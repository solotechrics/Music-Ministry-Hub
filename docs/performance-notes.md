# Performance notes

## Pagination

`GET /songs`, `GET /assignments`, `GET /submissions/mine`, and `GET /assignments/:id/submissions` accept `page` and `limit`. Defaults are page 1 and 20 records; page must be a positive integer and limit must be 1–100. The Express 5 query object is read-only, so validation stores the parsed values in `req.pagination` without changing `req.query`.

Each response has the form `{ "data": [], "page": 1, "limit": 20, "total": 0, "totalPages": 0 }`. Results keep the existing list order: songs by title ascending; assignments and submissions newest first.

## Indexes

- `Song.title` ascending supports the sorted song list.
- `Assignment.createdAt` descending supports the newest-first assignment list.
- `Assignment.song` supports filtering assignments for a song.
- `Submission.member` plus `createdAt` descending supports a member's newest-first submission list.
- `Submission.assignment` plus `createdAt` descending supports an assignment's newest-first submission list.
- The existing unique `Submission.assignment` plus `member` index enforces one submission per member and assignment and supports lookups by that pair.
- `Member.email` is unique and supports exact login lookup while preventing duplicate accounts.

Pagination uses `skip` and `limit`, which is straightforward for this project but can become slower at very high page numbers. Cursor pagination would be a useful next step if the dataset grows substantially. Counts are exact and add a count query to each paginated request.
