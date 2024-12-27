# Quest Bound

Quest Bound is a free and open source engine for creating digital tabletop role playing games. This repo contains all of its source code, its open source license and terms of use.

![Screenshot 2024-12-27 at 8 33 12 AM](https://github.com/user-attachments/assets/98809869-265b-40cf-b45e-555682b42888)


[Getting Started](https://github.com/curtmorgan3/quest-bound#getting-started)

[Bootstrapping](https://github.com/curtmorgan3/quest-bound#bootstrapping)

[Running Quest Bound](https://github.com/curtmorgan3/quest-bound#starting-quest-bound)

[Contributing](https://github.com/curtmorgan3/quest-bound#contributing-to-quest-bound)

[Report Bugs or Request Features](https://github.com/curtmorgan3/quest-bound#issues)

[About the Creator](https://github.com/curtmorgan3/quest-bound#about-the-creator)

## Sponsor Shoutout

Special thanks to those who have supported Quest Bound's development above and beyond what's been expected of them.

[Crow Brain Games](https://crowbraingames.com/)

[Roll 4 Gravity](https://www.roll4gravity.com/)

T.L. Bainter

GM Pak


## Getting Started

Quest Bound is a web application written entirely in TypeScript, a high level programming language that compiles to JavaScript. You will run two separate applications to use Quest Bound--a server and a client. When both are running, you'll access Quest Bound through a web browser of your choice.

### Source Code

Download the source code as a zip file and unzip it on your computer anywhere you'd like. Even though Quest Bound will be running on your own computer, it is not a native application, so it isn't picky about where its files are located.

![Screenshot 2024-12-27 at 9 59 17 AM](https://github.com/user-attachments/assets/0542e7af-4a61-4560-bf6f-ba22924c5f5f)

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

Boostrapping Quest Bound only needs to be done once. After you get it running the first time, you can simply [start it](https://github.com/curtmorgan3/quest-bound#starting-quest-bound).

### Docker

Install and open Docker Desktop.

![Screenshot 2024-12-27 at 8 00 56 AM](https://github.com/user-attachments/assets/ddc43848-9556-4e4c-af9d-d993ccb4d486)

In your terminal, navigate to wherever you placed the unzip source code. For example:

```
cd ~/Documents/quest-bound
```

This command will vary depending on your operating system and where you placed the unzipped source code. In most terminal applications,
dragging the folder into the terminal will paste its absolute path.

It should be in a file structure like this.

![Screenshot 2024-12-27 at 8 02 25 AM](https://github.com/user-attachments/assets/a7af5000-b4d9-4e78-9f80-a706ec7a79bb)

From the top level directory, called `quest-bound`, run the following command:

```
docker compose up --build
```

The `docker` command should have been made available on your machine when you installed Docker Desktop. If it isn't, follow the steps [here](https://www.docker.com/get-started/).

![Screenshot 2024-12-27 at 9 27 34 AM](https://github.com/user-attachments/assets/95f19ea9-602e-452b-aba5-4457663d627a)


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

## About the Creator

My name's Curt and I've been a professional software developer since 2017, working for companies ranging between small startups to as large as Amazon Web Services. 

Quest Bound is the most ambitious and complex project I have ever worked on. What started as a simple idea for a more intelligent character generator evolved into an accessible engine for
creating the digital versions of custom TTRPGs. Eventually, it became clear that what I wanted to do was bring the power to create D&D Beyond level applications to independent game creators.

I spent nearly two years building Quest Bound, half of that full time while living on savings and all of it working more hours in a day than I should have been. When I realized I couldn't make QB work as a sustainable business, I decided to open source it so others may continue to use it forever. It is my hope that other developers and TTRPG enthusiasts will contribute to QB's continued development over time.

I've made a lot of mistakes and have learned an incredible amount by building Quest Bound--as a developer, an aspiring entrepenuer and as a responsible consumer of tabletop gaming. I consider Quest Bound to be my contribution to this community of gamers. Please use it freely, share it with others and contribute to it to make it better for everyone.
