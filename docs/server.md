# Eclesia Worship Server

Assuming that you already have setup the server with all the necessary environment variables, this section will give an overall explanation of how the server works.

### Table of Contents
- [TypeScript integration](#typescript)
- [Project structure](#structure)
- [Dropbox API implementation](#dropbox)
- [API endpoints](#endpoints)

<a id="typescript"></a>
## TypeScript integration
Before we dive into the project structure, we want to explain how the typescript code is compiled into plain javascript.

The folder `server_dist` represents the compiled javascript and everytime someone saves some changes in the typescript project it recompiles automatically. This folder is necessary for production and only changes during development will be compiled. To start the server in development mode, run `npm run server` or `npm run dev` to run all the application.

To not conflict with angular typescript configuration, `tsconfig-server.json` is responsible for all server typescript configurations. All other `tsconfig` files are referred to the Angular client.

<a id="structure"></a>
## Project structure
When you will first run the server, it will run 4 main steps:
1. Connect the MongoDB database.
2. Establish all API endpoints.
3. If the server is in production mode, it will require the compiled frontend ` ist` folder.
4. Run error middleware whenever an endpoint fails to respond (such as 404 or 500 errors).

All these steps are embedded within the `server.ts` file, which extracts all the necessary code from the `server` folder.

The `server` folder is currently split up in 5 main folders:
1. `config`. This is responsible for the MongoDB configuration, as well as other configuration in the future.
2. `controllers`. All the logic of a given API endpoint is written here and is responsible for handling incoming requests and returning responses to the client. Here is where most of the functionality is located.
3. `middleware`. Stores all the middleware functions that deal with certain requirements an endpoint might have (such as an access token) or deal with 404 errors and server errors.
4. `models`. This folder stores all the schemas necessary for inserting new documents in the database. These schemas define the structure of the data and prevent the creation of duplicates.
5. `routes`. Here are established all the endpoint methods as well as their destination and what middleware they require.

As stated above, most of the code is located in the `controllers` folder that handles all incoming requests (such as bible-api and Dropbox) and return responses to the client. Whenever a new controller is created, it needs to be attached on a route with the destination ('/api/myroute'), method (GET/POST/PUT/DELETE), and middleware if necessary

<a id="dropbox"></a>
## Dropbox API implementation

Dropbox API requires an access token to be able to make requests, however this token is temporary. A refresh token is required to always get new access tokens. This refresh token is stored in the `.env` file and is permanent.

In order to create a new refresh-token the code in the `/server/controllers/dropboxAuthExample.ts` file can be used in a separate server to generate a new refresh-token.

The temporary access token is used in the middleware and then attached to any necessary endpoints.

<a id="endpoints"></a>
## API Endpoints

The content below presents a list of all endpoints within the application, as well a brief description of them. Some may require a Dropbox access token in order to call them.

`POST /api/refresh-token`<br/>
Gets a fresh Dropbox access token. It only requires the Dropbox refresh token and client id.

`GET /api/bible?=INSERT_PASSAGE`<br />
Gets the Bible passage from bible-api.com by specifying the passage.

`POST /api/sync/songs`<br/> **DROPBOX ACCESS TOKEN REQUIRED**<br />
Gets all the songs from the Dropbox database and creates MongoDB documents corresponding with all the songs specified before. Requires a Dropbox access token in order to be called.

`POST /api/sync-partial/songs`<br/> **DROPBOX ACCESS TOKEN REQUIRED**<br />
Syncs only 5 songs from the Dropbox database. Only used for testing purposes.

`GET /api/songs?search={INSERT_SEARCH}&limit=${INSERT_LIMIT}`<br />**DROPBOX ACCESS TOKEN REQUIRED**<br />
Used to get songs by searching via user input and/or limiting the amount of songs that can be requested. Both of these queries are optional.

`GET /api/songs/:title`<br/>**DROPBOX ACCESS TOKEN REQUIRED**<br />
Finds the song with the specified title. Every song has a specific title and no duplicates can exist.

`POST /api/sync/playlists`<br />**DROPBOX ACCESS TOKEN REQUIRED**<br />
Gets all the playlists (which contain titles for the songs) and creates MongoDB documents corresponding with all the playlists specified before.

`POST /api/sync-partial/playlists`<br />**DROPBOX ACCESS TOKEN REQUIRED**<br />
Syncs only one playlist from Dropbox. Only used for testing purposes.

`GET /api/playlists`<br />**DROPBOX ACCESS TOKEN REQUIRED**<br />
Used to get playlists by searching via user input and/or limiting the amount of playlists that can be requested. Both of these queries are optional.

`/api/playlists/:id`<br />**DROPBOX ACCESS TOKEN REQUIRED**<br />
Finds the playlist corresponding with the specified id. This id is created by MongoDB when the playlist is created.


