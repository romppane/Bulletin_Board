# Bulletin Board

RESTful API for bulletin board web application.

## Project configurating and launching:

### Install

```
$ npm install
```

### Configure

1. Make a copy of `.env-example` file and rename it as `.env`
2. Replace the values in DB_URL to match with your local development environment-
3. Fill in `DB_NAME` with the same value as you did at the end of URL.
4. If it's necessary for you to make changes in your database, leave the value of synchronize as `true`.

   NOTE: In case you're running the project in production mode, switch the value of `DB_ENTITIES` to `./build/entities/*.js`

Example:

```
DB_URL = mysql://user1234:CatsandDogs123@localhost:3306/testDB
DB_NAME = testDB
DB_SYNCHRONIZE = false
DB_LOGGING = false
DB_ENTITIES = ./server/entities/*.ts
PORT = 3000
```

To keep logs from updating in git, run:

```
$ git update-index --assume-unchanged logs/info.log

$ git update-index --assume-unchanged logs/error.log
```

Your project should now be good to run.

### Compile

```
$ npm run tsc
```

### Run

dev mode:

```
$ npm run dev
```

producion mode:

```
$ npm run prod
```
