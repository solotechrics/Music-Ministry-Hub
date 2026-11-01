# Five-minute walkthrough script — DRAFT

> Replace bracketed text with your own live URL and Postman values. Do not show passwords, connection strings, or secret environment values on screen.

## 0:00–0:35 — Introduce the problem

“Music Ministry Hub gives directors one place to manage songs and practice assignments, while members can submit a recording link and see their own work. This project is an API; it does not include a frontend, media uploads, or service setlists yet.”

## 0:35–1:15 — Show the health check

In Postman, select the Music Ministry Hub environment and send:

```http
GET {{baseUrl}}/health
```

“The health endpoint returns a small status response so a person or host can check that the API process is responding.”

## 1:15–2:10 — Log in and show authorization

Send the **Login member** request using the demo account only on a local demo database. Let the collection save the returned token to the local environment. Then send:

```http
GET {{baseUrl}}/auth/me
Authorization: Bearer {{memberToken}}
```

“The token identifies the caller, and the API loads that member record before it decides what the caller can do.”

## 2:10–3:05 — Show the paginated song list

Send:

```http
GET {{baseUrl}}/songs?page=1&limit=20
Authorization: Bearer {{memberToken}}
```

“List responses carry the records in `data`, along with page, limit, total, and totalPages. Invalid values, such as page zero or a limit over 100, receive a validation error.”

## 3:05–4:10 — Explain one technical decision

“I used offset pagination with a maximum page size of 100 because it is easy for a small API to explain and use. I added indexes for the list sort and filter fields. If the collections grow very large, cursor pagination and approximate counts are candidates for a later version.”

Show the relevant route and model index, then switch back to the API response.

## 4:10–5:00 — Close with verification and limits

“The automated suite exercises the API with isolated in-memory MongoDB, so it does not need my development or production database. The first run needs internet to download the MongoDB binary. The API still needs a live Atlas and Render deployment, and the rate limit currently uses process memory.”

Add your deployment and recording links after you complete them: **[LIVE API URL]** and **[VIDEO LINK]**.
