# Deploy to Render with MongoDB Atlas

This guide deploys the API only. Do not commit your Atlas URI, database password, or JWT secret.

## 1. Create an Atlas database

1. Sign in to MongoDB Atlas, create a project, and create a cluster. Choose the region closest to your Render service.
2. Under **Database Access**, create a database user with a unique username and password. Give the user only the database access needed by this app (read/write to the application database). This is separate from your Atlas website login.
3. Under **Network Access**, allow the Render service's outbound IP ranges. In Render, open the service's **Connect** menu and **Outbound** tab to see the ranges for its region. Add those ranges in Atlas. Do not use `0.0.0.0/0` as a shortcut. For setup from your own computer, add your current IP temporarily and remove it when you finish.
4. In Atlas, open **Connect**, choose the Drivers connection method, and copy the connection string. Replace its username and password with the database user credentials. URL-encode special characters in the password and use the application database name, for example `music_ministry_hub`, in the URI path.

Atlas references: [connect to a cluster](https://www.mongodb.com/docs/atlas/connect-to-database-deployment/), [database user and cluster security](https://www.mongodb.com/docs/atlas/setup-cluster-security/), and [IP access list](https://www.mongodb.com/docs/atlas/security/add-ip-address-to-list/).

## 2. Create the Render web service

1. Push the reviewed repository to a Git host you control. In the Render dashboard choose **New > Web Service**, connect the repository, and select the branch to deploy.
2. Choose Node. Set the build command to `npm install` and the start command to `npm start`.
3. Set the health check path to `/api/health` in the service's health check settings.
4. Add these environment variables in Render's **Environment** settings:

   | Name | Value |
   | --- | --- |
   | `NODE_ENV` | `production` |
   | `MONGODB_URI` | Your Atlas connection string, including the database name |
   | `JWT_SECRET` | A long, random, unique secret generated for this deployment |
   | `CORS_ORIGIN` | The exact browser origin(s) allowed to call the API; separate multiple origins with commas |
   | `AUTH_RATE_LIMIT_WINDOW_MS` | `900000` (15 minutes) |
   | `AUTH_RATE_LIMIT_MAX` | `10` requests per IP per window on each auth endpoint |

   Render supplies `PORT`; the server reads it automatically. `JWT_EXPIRES_IN` is optional and defaults to `1d`.
5. Save the settings and deploy. Render runs the service using `npm start`; check the deploy log for “MongoDB connected” and a successful health check.

Render references: [deploy a Node/Express app](https://render.com/docs/deploy-node-express-app), [environment variables and secrets](https://render.com/docs/configure-environment-variables), and [health checks](https://render.com/docs/health-checks).

## 3. Seed a new, empty database carefully

The seed script **deletes all existing songs, members, assignments, and submissions before inserting its demo records**. Use it only on a new, empty application database. It refuses to run in production unless the explicit confirmation variable is set.

To seed from your computer, put the Atlas URI and a temporary `NODE_ENV=production` in a local `.env` file that is ignored by Git, then run:

```sh
CONFIRM_DESTRUCTIVE_SEED=YES npm run seed
```

Remove the temporary confirmation value immediately. Do not run this against a database containing real ministry data. Demo accounts use the shared example password `Password123`; change or remove them before inviting real users.

## 4. Check the deployed API

1. Copy the Postman environment template at `docs/postman/music-ministry-hub.template.postman_environment.json` and set `baseUrl` to `https://YOUR-SERVICE.onrender.com/api`.
2. Select the environment in Postman. Call `GET {{baseUrl}}/health`; expect `{ "status": "ok" }`.
3. Use the collection's login requests with a seeded demo account, then call protected endpoints. Store the returned token only in your local Postman environment.
4. Check the paginated list requests for the `{ data, page, limit, total, totalPages }` response shape.

Free Render web services sleep after 15 minutes without inbound traffic. The next request starts the service again and can take about a minute, so the first request after idle can be slow. [Render free service behavior](https://render.com/docs/faq).
