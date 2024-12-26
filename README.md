# Quest Bound

## Getting Started

### Required Downloads

### Recommended Downloads

### Bootstrapping

#### Server

Start PostgreSQL Server on port 5432 (default for Postgres).

Open `server/local.env.txt` in a text editor. Optionally change the database name and password.

Navigate to `server` and run `npm run bootstrap`
This will add environment variables, create the database, add folders for file storage and build the server application.

Run `npm run start`. You should see the following message:
`Server is running at http://localhost:8000`

#### Client

## Authentication

_For personal use not requiring authentication:_

Pass the current user's ID as the Authorization header of every requestion. `Authorization: Bearer <id>`
You can get the current user's ID by hitting the `/signin` restful endpoint.

The `useSessionToken` hook is setup to store and retrieve the current user's ID from local storage. The GraphQL provider will
pull that 'token' from this hook at automatically add it to all requests.

_To implement authentication:_

- Client:

  - Update the `useSessionToken` to use some token pulled from cookies, depending on your auth strategy
  - Swap out the sign in method used in `SignUpForm`

- Server:

  - Update the authorizer (`/infrastructure/authorizer/authorizer.ts`), setting `AUTHENTICATION_REQUIRED` to `true` and following the comments to
    implement your token verification logic.

## Storage

This version of Quest Bound is set up to serve image and PDF files directly from the web server. For a handful of users, this is fine. For anything larger, you'll want to set up a CDN, like AWS S3.

_It is highly recommeneded that you host images elsewhere!_

You have the option to either select an image _or_ enter its URL. If you're not connecting a CDN to Quest Bound, it's highly recommended that you use the URL option. This lets Quest Bound fetch images from the internet instead of storing them on its own server. The QB server was never intended to store and serve images, so doing so is very slow.

To connect a CDN to Quest Bound:

- Server:

  - Update APIs in `rest/services/storage` to manage uploads to your CDN.
  - Remove static route in `app.ts`

- Client:

  - Remove `addStaticDomain` Apollo link in GraphQL provider

## Tips & Tricks

### Delete Database

`DROP DATABASE IF EXISTS "qbdb" ;`
