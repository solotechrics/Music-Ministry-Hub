# Local setup guide

## 1. Clone and install

Install a supported Node.js LTS version and Git, then run:

```sh
git clone https://github.com/solotechrics/Music-Ministry-Hub.git
cd Music-Ministry-Hub
npm ci
```

## 2. Configure the database and secrets

Copy `.env.example` to `.env`. Set `MONGODB_URI` to a local MongoDB database, and replace the example `JWT_SECRET` with a long random value. Keep `.env` local; it is ignored by Git. Start MongoDB before starting the API. The example `.env` includes the local URL and browser origin; change `CORS_ORIGIN` if your frontend uses a different origin.

The database-backed Jest tests do not read `MONGODB_URI`; they start their own isolated in-memory MongoDB. The first test run downloads a MongoDB binary and needs internet access. If `mongod` is already installed, use `MONGOMS_SYSTEM_BINARY=/path/to/mongod npm test` with your local executable path.

## 3. Seed and start

Run `npm run seed` only against a new or disposable database. It deletes existing songs, members, assignments, and submissions before adding demo data. Then start the API:

```sh
npm run seed
npm start
```

The API listens on the configured `PORT` (default `3006`). Check `http://localhost:3006/api/health` for `{ "status": "ok" }`.

## 4. Run tests

```sh
npm test
npm run test:coverage
```

Tests use in-memory MongoDB and Supertest; they do not modify the local database configured in `.env`.

## 5. Call the API

The base URL is `http://localhost:3006/api`. Public signup and login accept JSON. Protected routes need `Authorization: Bearer <token>`.

```sh
curl http://localhost:3006/api/health
curl -X POST http://localhost:3006/api/auth/login \
  -H 'Content-Type: application/json' \
  -d '{"email":"member@example.com","password":"Password123"}'
curl 'http://localhost:3006/api/songs?page=1&limit=20' \
  -H 'Authorization: Bearer <TOKEN_FROM_LOGIN>'
```

The seed script creates `director@example.com`, `director2@example.com`, `member@example.com`, and `member2@example.com`; all demo accounts use `Password123`. Change or remove them before using a live database with real members. The Postman collection and environment template are in `docs/postman/`.
