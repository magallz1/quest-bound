# Quest Bound

Quest Bound is a free and open source engine for creating digital tabletop role playing games. This repo contains all of its source code, its open source license and terms of use.

[Getting Started](https://github.com/curtmorgan3/quest-bound/edit/main/README.md#getting-started)

[Bootstrapping](https://github.com/curtmorgan3/quest-bound/edit/main/README.md#bootstrapping)

[Running Quest Bound](https://github.com/curtmorgan3/quest-bound/edit/main/README.md#starting-quest-bound)

[Contributing](https://github.com/curtmorgan3/quest-bound/edit/main/README.md#contributing-to-quest-bound)

[Report Bugs or Request Features](https://github.com/curtmorgan3/quest-bound/edit/main/README.md#issues)


## Getting Started

Quest Bound is a web application written entirely in TypeScript, a high level programming language that compiles to JavaScript. You will run two separate applications to use Quest Bound--a server and a client. When both are running, you'll access Quest Bound through a web browser of your choice.

### Source Code

Download the source code as a zip file and unzip it on your computer anywhere you'd like. Even though Quest Bound will be running on your own computer, it is not a native application, so it isn't picky about where its files are located.

### Required Downloads

**Docker**

To make it as easy to run as possible, Quest Bound has been encapsulated into a Docker container. Docker is a separate application that will run Quest Bound inside a virtual machine on your computer, relieving you of downloading and installing the several specific runtimes QB requires.

Download [Docker Desktop](https://www.docker.com/products/docker-desktop/). You will not need a paid account.

### Recommended Downloads

**Database Client**

It is sometimes helpful to view the data in your database through a graphical client. This isn't strictly necessary. You can also run SQL commands through your terminal to execute raw database queries.
My favorite client for Postgres is [Postico](https://eggerapps.at/postico2/). A great alternative is [DB Beaver](https://dbeaver.io/).

**Text Editor**

You will only find this useful if you intend to edit Quest Bound's source code. If you do, you likely already have a favorite code editor. Mine is [VS Code](https://code.visualstudio.com/download).


### Bootstrapping

Boostrapping Quest Bound only needs to be done once. After you get it running the first time, you can simply [start it](https://github.com/curtmorgan3/quest-bound/edit/main/README.md#starting-quest-bound).

### Docker

Install and open Docker Desktop.

![Screenshot 2024-12-27 at 8 00 56 AM](https://github.com/user-attachments/assets/ddc43848-9556-4e4c-af9d-d993ccb4d486)

In your terminal, navigate to wherever you placed the unzip source code. It should be in a file structure like this.

![Screenshot 2024-12-27 at 8 02 25 AM](https://github.com/user-attachments/assets/a7af5000-b4d9-4e78-9f80-a706ec7a79bb)

From the top level directory, called `quest-bound`, run the following command:

```
docker compose up --build
```

The `docker` command should have been made available on your machine when you installed Docker Desktop. If it isn't, follow the steps [here](https://www.docker.com/get-started/).

This command will install several images on your machine. Each of them has a critical piece of infrastructure that Quest Bound needs. After those are downloaded, it will build the server and client applications. This should take five to ten minutes total. 

When it's finished, you should see four new images listed in Docker Desktop.

- quest-bound-client
- quest-bound-server
- redis/redis-server-stack
- postgres

![Screenshot 2024-12-27 at 8 07 31 AM](https://github.com/user-attachments/assets/a4a99c2d-aab5-4047-b4c4-45ad300518db)

In your containers list, you should see a new collapsible list of containers called `quest-bound`. If this parent container is running, go ahead a click the stop button to stop it. 
This should clear the running process in your terminal.

## Running Quest Bound

Open Docker Desktop and click on `quest-bound` to see a list of containers and a running log.

![Screenshot 2024-12-27 at 8 11 54 AM](https://github.com/user-attachments/assets/c4b6e277-c8d2-4ae9-9c27-400cdfaa3a04)

Start each container in this order, waiting for the corresponding message to show it started successfully.

- quest-bound-redis: `Ready to accept connections tcp`
- quest-bound-db: `database system is ready to accept connections`
- quest-bound-server: `[server]: Server is running at http://localhost:8000`
- quest-bound-client: `Local:   http://localhost:5173/`

Once all four containers are running successfully, open a web browser to test the services.

`http://localhost:8000`

![Screenshot 2024-12-26 at 9 45 07 AM](https://github.com/user-attachments/assets/85c0008d-c4e9-4549-8b53-05bb1027446f)

`http://localhost:5173`

![Screenshot 2024-12-27 at 8 18 14 AM](https://github.com/user-attachments/assets/f0ee2059-1291-408d-a97f-b597d1c2518f)


## Contributing to Quest Bound

You can find documentation on developing Quest Bound on this repo's wiki.

### Issues

To report bugs, create an issue in this repository and select the bug template. Issues will be updated and closed as they are addressed.

### Discussions

Use discussions to chat about potential features and updates with other users. 

### Pull Requests

To submit a contribution, push your work to a feature branch and create a pull request to the main branch. Follow the PR template.
Currently, all pull requests are reviewed by a single code owner, but this policy may change over time.

### Bootstrapping

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

### Starting

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



### Client

The client is the actual web application that powers the Quest Bound user interface. It runs on its own web server, allowing you to access the application through any browser you choose. You can access Quest Bound from multiple browser instances or profiles on your computer. You only need to run the client once.

On your second terminal, run the following:

```
cd ./client && npm run start
```

Navigate to [http://localhost:5173](http://localhost:5173) in your browser to use Quest Bound.

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

### Terminal

Boostrapping and starting Quest Bound require running commands from a command line using an interpreter called *Bash*.

*MacOS & Linux*

Bash is installed and used by default. Open your Terminal application to use bash commands.

*Windows 10 or Greater*

Bash is installed through a subsystem called Windows Subsystem for Linux (WSL). Follow the instructions [here](https://www.geeksforgeeks.org/use-bash-shell-natively-windows-10/) to enable it, then run commands from the Windows Terminal.

*Older Windows*

You'll need to use something like [Git Bash](https://gitforwindows.org/).

### Required Downloads for Contributing (Advanced)

If you intend to develop Quest Bound, either for personal use or to contribute to the project, you might find it more useful to run the services locally outside of a Docker container. To do so, you'll at least need Node
installed on your machine. Optionally, you can run a local PostgreSQL server, or run one through Docker.

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
