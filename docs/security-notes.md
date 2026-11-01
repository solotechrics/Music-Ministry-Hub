# Security notes

## In place

- Helmet sets common HTTP security headers.
- CORS allows the origins in `CORS_ORIGIN`; the default is only `http://localhost:3000`. Multiple allowed origins can be separated by commas.
- Express trusts one proxy hop so Render's forwarded client address can be used by rate limiting. Do not put an untrusted proxy in front of the service.
- Login and signup have independent rate limiters. `AUTH_RATE_LIMIT_WINDOW_MS` and `AUTH_RATE_LIMIT_MAX` set the window and request count. The limiter is bypassed when `NODE_ENV=test` so tests remain independent.
- JSON request bodies are limited to 100 KB. Oversized bodies receive a 413 response.
- Zod validates each body at the route boundary. Login requires `email` and `password` to be strings, so object selectors such as `{ "$ne": null }` fail before the database query. Zod also removes unknown object keys from its parsed result; the validator replaces `req.body` with that result. The routes construct MongoDB filters from validated scalar values and fixed field names, never from a client-supplied query object.
- Startup exits with a clear error when `JWT_SECRET` is absent. Passwords are hashed, omitted from JSON, and JWTs are checked against the current member record.
- Error responses use a fixed message and do not include stack traces.

## Remaining risks

- Rate limiting uses the process memory store. It does not share counts across multiple Render instances and resets on restart; use a shared store if the app scales out.
- The example secret in `.env.example` is a placeholder. Production must use a long, unique secret stored in Render's environment settings.
- CORS is a browser policy, not authentication. Protected endpoints still require a valid bearer token.
- The API stores links to recordings rather than validating ownership or safety of linked content.
- MongoDB network access and credentials must be restricted in Atlas. Do not expose the cluster broadly for convenience.

## Dependency audit

`npm audit` on 2026-11-01 reported **21 vulnerabilities: 3 low, 17 moderate, and 1 high**. The high finding is in transitive `body-parser@2.3.0` (compressed request body denial of service); npm reported a compatible fix. The moderate findings include Jest 30.5.2 dependencies and `nodemon@3.1.14`/`minimatch@10.2.6`. npm's suggested Jest and nodemon remediations are major downgrades to old versions, so they were not applied automatically. Re-run `npm audit` before deployment and review newer compatible patches.
