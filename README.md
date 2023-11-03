# Eclesia Worship

Eclesia Worship is a web app that syncs with a shared Dropbox folder to manage and present songs.

## Set up the environment

In order to run the app locally you must have Node.js installed (preferably v.18) and MongoDB.

A .env file is required with the following variables: PORT (8080), NODE_ENV (production/development), DROPBOX_REFRESH_TOKEN, DROPBOX_CLIENT_ID, DROPBOX_CLIENT_SECRET, MONGO_URI (mongodb://127.0.0.1:27017/eclesia-worship)

Afterwards, in order to start both the backend and frontend dev servers, you can run:

```bash
npm run start:dev:servers
```

In order to run Cypress e2e tests run:

```bash
npm run cy:run
```
