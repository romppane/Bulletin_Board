# Bulletin Board

RESTful API for bulletin board web application.

## Project configurating and launching:

### Install

```
$ npm install
```

### Configuration

1. Make a copy of `docker-compose.override-example.yml` and rename it as `docker-compose.override.yml`
2. OPTIONAL! Change the environmental variables to your liking keeping the balance between database and web!
3. Build the image:

```
$ docker build -t bulletin-board .
```

Your project should now be good to run.

### Run

```
$ docker-compose up
```

When ever you make a change in your code, run the command again in order to make it live!
