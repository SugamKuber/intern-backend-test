# EMURGO Backend Intern Challenge

This challenge is designed to evaluate your skills with building APIs and interacting with databases. We are looking for a clean, well-structured, and tested codebase. We are also looking for your ability to understand the requirements and to make decisions based on them.

Please read all instructions bellow carefully.

## Instructions
Fork this repository and make the necessary changes to complete the challenge. Once you are done, simply send your repository link to us and we will review it.

## Setup
This coding challenge uses [Bun](https://bun.sh/) as its runtime. If you are unfamiliar with it, you can follow the instructions on the official website to install it - it works pretty much the same as NodeJS, but has a ton of features that make our life easier, like a built-in test engine and TypeScript compiler.

Strictly speaking, because we run this project on Docker, you don't even need to have Bun installed on your machine. You can run the project using the `docker-compose` command, as described below.

The setup for this coding challenge is quite simple. You need to have `docker` and `docker-compose` installed on your machine. If you don't have them installed, you can follow the instructions on the official docker website to install them.

https://docs.docker.com/engine/install/
https://docs.docker.com/compose/install/

Once you have `docker` and `docker-compose` installed, you can run the following command to start the application:

```bash
docker-compose up -d --build
```

or using `Bun`

```bash
bun run-docker
```

## The Challenge
Your job is to create an API to manage a list of books for users.

### API Operations
The API should have the following operations and you should create the necessary database schema to support them:

#### Create a new user (`POST /users`);
- Create a new user with username and password.
- Take all the necessary measures to store the password securely;
- Don't allow users with the same username to be created;

#### Authenticate a user (`POST /users/authenticate`);
- Given the username and password, return a JWT token that can will be used to perform the other operations.

#### Create a new book (`POST /books`);
- Given the book's information, create it on the database.
- Only allow authenticated users to create books.

#### Attach a book to the user (`POST /users/:userId/books/:bookId`);
- Attaches the book to the user.
- Only allow authenticated users to attach books to themselves.
- Prevent users to attach books for other users, in other words, validate if the JWT used to authenticate the request belongs to the `userId` on the path.

### Tests
You should write tests for all the operations described above. Anything you put on the `spec` folder in the format `*.spec.ts` will be run by the test engine.

Here we are evaluating your capacity to understand what should be tested and how. Are you going to create abstractions and mock dependencies? Are you going to test the database layer? Are you going to test the API layer? That's all up to you.

## Further instructions
- We expect you to handle errors and edge cases. Understanding what these are and how to handle them is part of the challenge.
- Feel free to change literally anything about this project. We already provided you a sample to run an API and a Postgres database on Docker and gave you samples for interacting with the database. All that we require is that if you do change something, you should explain why you did it and provide us with the necessary instructions to run the project.
- The API paths above are just suggestions, so feel free to change them as well - although if you do change them, we expect that it still covers all the necessary operations we describred.

# Guide to usage [EDIT]
1. Import the postman collection file
2. "bun start" or "bun run run-docker"
3. Test the API's from postman
4. "bun run test" for running the tests cases (19 cases)
(make sure the database is working)

### Improvements
1. Test cases handling
2. More types in required places