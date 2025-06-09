# XBorg Tech Challenge

## Submission Requirements

- Unit Tests
- Integration Tests
- E2E Testing
- Testing Performance benchmarks
- Clearly document strategies via effective testing and in the Submission Documentation section of the ReadMe

Implementation should be submitted via a public GitHub repository, or a private repository with collaborator access granted to the provided emails.

## Architecture

- Language - Typescript
- Monorepo - Turborepo
- Client - NextJs
- Api - NestJs
- DB - SQLite

## Apps and Packages

- `client`: [Next.js](https://nextjs.org/) app
- `api`: [Nestjs](https://nestjs.com) app
- `tsconfig`: Typescript configuration used throughout the monorepo

## Utilities

- [TypeScript](https://www.typescriptlang.org/) for static type checking
- [ESLint](https://eslint.org/) for code linting
- [Prettier](https://prettier.io) for code formatting
- [Husky](https://typicode.github.io/husky/) for Git hooks

## Steps to run app

#### Install Metamask [link](https://chromewebstore.google.com/detail/nkbihfbeogaeaoehlefnkodbefgpgknn?utm_source=item-share-cb)

#### Run commands in order

```bash
# Enter all commands from the project root

# Start the infrastructure (Requires Docker)
$ yarn start:local:infra

# Install dependencies
$ yarn install

 # Build the app including the lib
$ yarn build

# Migrate the DB
$ cd apps/api && yarn migrate:local

 # Run the application stack in dev
 $ yarn dev
```

## Additional Commands

```bash
# Run tests in all apps
$ yarn test

# Run linter in all apps
$ yarn lint

# Format code in all apps
$ yarn format

```

## Submission Documentation...
