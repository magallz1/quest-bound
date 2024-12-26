# Quest Bound

## Getting Started

### Terminal

Boostrapping and starting Quest Bound require running commands from a command line using an interpreter called *Bash*.

*MacOS & Linux*

Bash is installed and used by default. Open your Terminal application to use bash commands.

*Windows 10 or Greater*

Bash is installed through a subsystem called Windows Subsystem for Linux (WSL). Follow the instructions [here](https://www.geeksforgeeks.org/use-bash-shell-natively-windows-10/) to enable it, then run commands from the Windows Terminal.

*Older Windows*

You'll need to use something like [Git Bash](https://gitforwindows.org/).

### Required Downloads

**Node**

Quest Bound is written entirely in TypeScript, which compiles to JavaScript. You need a JavaScript runtime environment on your computer in order to boostrap and start the application.

Download NodeJS version 22 or greater here:
https://nodejs.org/en/download/prebuilt-installer

**PostgreSQL**

Postgres is an open source SQL based relational database. You'll need to have a Postgres server running on your computer any time Quest Bound is running.

*MacOS*

I recommend downloading Postgres through the native application here:
[https://postgresapp.com/](https://postgresapp.com/downloads.html)

*Windows & Linux*

Download Postgres version 14 or greater here:
https://www.postgresql.org/download/

### Recommended Downloads

**Database Client**

It is sometimes helpful to view the data in your database through a graphical client. This isn't strictly necessary. You can also run SQL commands through your terminal to execute raw database queries.
My favorite client for Postgres is [Postico](https://eggerapps.at/postico2/). A great alternative is [DB Beaver](https://dbeaver.io/).

**Text Editor**

You will only find this useful if you intend to edit Quest Bound's source code. If you do, you likely already have a favorite code editor. Mine is [VS Code](https://code.visualstudio.com/download).


### Bootstrapping

Boostrapping Quest Bound only needs to be done once. After you get it running the first time, you can simply [start it](https://github.com/curtmorgan3/quest-bound/edit/main/README.md#starting-quest-bound).

#### Server

Start your PostgreSQL Server on port 5432. If you're using the Postgres app, you can create a new server and select the version and port. You can name the server whatever you'd like and leave the rest as their defaults.

![Screenshot 2024-12-26 at 9 24 37 AM](https://github.com/user-attachments/assets/6a376fc0-cc8d-4b39-ab72-4a9ae423dda5)

If you're not using the Postgres app on MacOS, refer to the instructions given your particular installation to start the Postgres server. For example, [this guide](https://neon.tech/postgresql/postgresql-getting-started/install-postgresql) might be helpful for Windows users. 


> *Optional*
> 
> Open `server/local.env.txt` in a text editor like notepad. Here you can set the name of your database and assign a password if you prefer.

`cd` to wherever the `quest-bound` directory is stored, then into the `server` directory.

For example, `cd ~/Documents/quest-bound/server`.

Run the following:

```
npm run bootstrap
```

This will add environment variables, create the database, add folders for file storage and build the server application.

#### Client

`cd` to wherever the `quest-bound` directory is stored, then into the `client` directory.

For example, `cd ~/Documents/quest-bound/client`.

Run the following:

```
npm run bootstrap
```

This will install software that Quest Bound uses internally, then compile it into the application.

## Starting Quest Bound

Ensure your Postgres server is running on port 5432.

Open two terminals. On each, navigate to wherever the `quest-bound` directory is stored. 

For example, `cd ~/Documents/quest-bound`.

### Server
The server handles all communication between the web application and the database. While you can technically have as many clients running as you want, only one server should be used.

On your first terminal, run the following:

```
cd ./server && npm run start
```

You should see the message `[server] Server is running at http://localhost:8000`

You can navigate to the url in your browser to make sure the server is running.

![Screenshot 2024-12-26 at 9 45 07 AM](https://github.com/user-attachments/assets/85c0008d-c4e9-4549-8b53-05bb1027446f)

### Client

The client is the actual web application that powers the Quest Bound user interface. It runs on its own web server, allowing you to access the application through any browser you choose. You can access Quest Bound from multiple browser instances or profiles on your computer. You only need to run the client once.

On your second terminal, run the following:

```
cd ./client && npm run start
```

Navigate to [http://localhost:5173](http://localhost:5173) in your browser to use Quest Bound.

## Developing Quest Bound

### Client
-------------------

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
