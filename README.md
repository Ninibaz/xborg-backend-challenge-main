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
1. Unit Tests
Goal:
Test individual units (functions, classes, methods) in isolation, mocking all external dependencies.

Approach in this repo:

Use Jest and @nestjs/testing to create test modules.
Mock dependencies such as PrismaService, ConfigService, or any external API.
Focus on business logic, not on database or framework integration.
Example:

prisma.service.spec.ts:
Tests the PrismaService methods (like onModuleInit, enableShutdownHooks) by mocking the logger and ConfigService.
app.module.spec.ts:
Verifies that AppModule imports the correct modules and can be instantiated.
main.spec.ts:
Mocks NestFactory and tests the bootstrap logic for microservice startup.
Best Practices:

Use spies and mocks for dependencies.
Assert on method calls, thrown errors, and return values.
Fast and deterministic (no real DB or network).
2. Integration Tests
Goal:
Test how multiple components work together, including real framework wiring and database access.

Approach in this repo:

Use Jest and @nestjs/testing to spin up real NestJS modules.
Use an in-memory SQLite database (file:memory:?cache=shared) for Prisma, so tests are fast, isolated, and do not need an external DB.
Do not mock the database—test real DB operations.
Test service, repository, and controller logic as they interact.
Example:

prisma.service.int-spec.ts:
Tests real Prisma database connection and lifecycle methods.
user.service.int-spec.ts:
Tests UserService and UserRepository together with a real DB.
user.controller.int-spec.ts:
Tests microservice message handlers for user signup/retrieval using a real DB.
app.module.int-spec.ts:
Boots the entire app and tests user flows through the real microservice stack.
Best Practices:

Use test-specific DB (in-memory, disposable).
Clean up data between tests.
Assert on real DB state and error handling.
3. End-to-End (E2E) Tests
Goal:
Test the system as a whole, from the entry point (e.g., microservice message, HTTP endpoint) through all layers to the database and back.

Approach in this repo:

Boot the entire application (all modules, real DB, real microservice transport).
Use a real ClientProxy to send microservice messages (TCP transport) to the app, simulating a real client.
Assert on the full user flow: user registration, duplicate registration, user retrieval, not-found error.
No mocks—everything is real except external infrastructure (using in-memory DB).
Example:

app.e2e-spec.ts:
Boots the full app, sends message patterns for user signup/retrieval, and verifies the full stack works as expected.
Best Practices:

Use isolated test DB for repeatability.
Clean up between tests.
Cover main user flows and error scenarios.
4. Performance Tests
Goal:
Measure how fast key operations are, and ensure they meet performance requirements.

Approach in this repo:

Use Node’s perf_hooks to measure the duration of each operation in E2E tests.
Each test logs how long the operation took and asserts it completes within a threshold (e.g., 200ms).
Example operations: user registration, duplicate registration, user retrieval, not-found error.
Example:

performance.benchmark-spec.ts:
Dedicated file running E2E flows and asserting they complete within a set time, logging the results for review.
Best Practices:

Run performance benchmarks in a controlled environment.
Set realistic thresholds based on expected production performance.
Use for regression detection (e.g., PRs that slow down critical paths).