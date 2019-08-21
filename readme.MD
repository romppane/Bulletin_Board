# Bulletin Board

RESTful API for bulletin board web application.

## Project configurating and launching:

**Prerequisites:** **_Node_**:_10.16.1_, **_npm_**:_6.9.0_, **_Docker_**:_19.03.1_

### Install

```
$ npm install
```

### Configuration

1. Make a copy of `docker-compose.override-example.yml` and rename it as `docker-compose.override.yml`
2. OPTIONAL! Change the environmental variables to your liking keeping the balance between database and web!

### Run

```
$ docker-compose up
```

NOTE! When installing new dependencies, use the `--build` flag at the end of the command to update the image.

# Demo

[Try the project on Heroku!](https://bulletin-board-onboarding-api.herokuapp.com/)

## /users/

#### GET

```json
[
  { "avatar": "Some link to image", "id": 1 },
  { "avatar": "Test data", "id": 3 },
  { "avatar": "Test data", "id": 4 },
  { "avatar": "avatar", "id": 5 }
]
```

#### POST

Body

```json
{
  "avatar": "New avatar"
}
```

Responce

```json
{
  "avatar": "New avatar",
  "id": 6
}
```

## /users/:id

Example: /users/1

#### GET

```json
{
  "avatar": "Some link to image",
  "id": 1
}
```

#### PUT

Body

```json
{
  "avatar": "Different avatar"
}
```

Responce

```json
{
  "avatar": "Different avatar",
  "id": 1
}
```

#### DELETE

`Status: 204 No Content`

## /posts/

#### GET

```json

```

#### POST

Body

```json

```

Responce

```json

```

## /posts/:id

Example: /posts/1

#### GET

```json

```

#### PUT

Body

```json

```

Responce

```json

```

#### DELETE

`Status: 204 No Content`

## /users/

#### GET

```json

```

#### POST

Body

```json

```

Responce

```json

```

## /comments/:id

Example: /comments/1

#### GET

```json

```

#### PUT

Body

```json

```

Responce

```json

```

#### DELETE

`Status: 204 No Content`
