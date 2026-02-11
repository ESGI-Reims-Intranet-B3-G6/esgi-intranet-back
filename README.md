# ESGI Intranet Backend

The backend part of the ESGI Intranet app.  
Built using [NestJS](https://nestjs.com/).

## Project setup

```bash
$ npm install
$ cp .env.example .env
# edit .env variables for your environment...
$ npm run typeorm migration:run
```

## Compile and run the project

```bash
# development
$ npm run start

# watch mode
$ npm run start:dev

# production mode
$ npm run start:prod
```

## Run tests

```bash
# unit tests
$ npm run test

# e2e tests
$ npm run test:e2e

# test coverage
$ npm run test:cov
```

## Run with Docker

```
docker build . -t esgi-b3-dev-g6/backend:latest
# Run locally
docker run --rm --env-file .env --net esgi-intranet esgi-b3-dev-g6/backend:latest
```

## Pre-commit setup

`npx husky init`  
If using GitHub Desktop on Windows, and it doesn't work, check your PATH environment variable and make sure C:\Program Files\Git\bin is added before %SystemRoot%\system32 and C:\Program Files\Git\cmd

## Resources

Visit the [NestJS Documentation](https://docs.nestjs.com) to learn more about the framework.
