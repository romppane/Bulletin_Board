# Bulletin Board

RESTful API for bulletin board web application.

[Check out my UI project too that uses this project as it's backend!](https://goofy-jones-1c4e18.netlify.com/)

[Link to the UI repository.](https://github.com/romppane/Bulletin_Board_UI)

## Project configurating and launching:

**Prerequisites:**

- **_Node_**: _10.16.1_
- **_npm_**: _6.9.0_
- **_Docker_**: _19.03.1_

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

[Try the project on Heroku!](https://bulletin-board-onboarding-api.herokuapp.com/v1/posts/)

NOTE! Because of the structure of database, inserting ownerId in posts and userId in comments is mandatory! The username attributes in posts and comments is only a temporary solution designed for demoing purposes until user features get fully implemented! The project seeds the database with a user who's got an ID of 1 use that that when inserting data to the database!

## /v1/posts/

#### GET

```json
[
  {
    "title": "Title",
    "message": "Cool!",
    "category": "default",
    "username": "Test user",
    "id": 1,
    "ownerId": 1,
    "views": 0,
    "createdAt": "2019-08-20T06:49:52.076Z",
    "updatedAt": "2019-08-21T11:42:21.000Z"
  },
  {
    "title": "What!",
    "message": "No one has ever done that!",
    "category": "default",
    "username": "PogChamp",
    "id": 3,
    "ownerId": 3,
    "views": 0,
    "createdAt": "2019-08-20T06:49:52.076Z",
    "updatedAt": "2019-08-21T11:33:46.000Z"
  }
]
```

#### POST

**Category options**: "default", "other"

Body

```json
{
  "title": "Sunny day!",
  "message": "Nice weather!",
  "category": "other",
  "username": "Chase McDude",
  "ownerId": 1
}
```

Response

```json
{
  "user": {
    "avatar": "Different avatar",
    "id": 1
  },
  "title": "Sunny day!",
  "message": "Nice weather!",
  "category": "other",
  "username": "Chase McDude",
  "ownerId": 1,
  "id": 4,
  "views": 0,
  "createdAt": "2019-08-21T11:44:42.809Z",
  "updatedAt": "2019-08-21T11:44:42.809Z"
}
```

## /v1/posts/:id

Example: /v1/posts/1

#### GET

```json
{
  "title": "Tittle",
  "message": "Cool!",
  "category": "default",
  "username": "Test user",
  "id": 1,
  "ownerId": 1,
  "views": 0,
  "createdAt": "2019-08-20T06:49:52.076Z",
  "updatedAt": "2019-08-21T11:42:21.000Z"
}
```

#### PUT

Body

```json
{
  "title": "Change title",
  "message": "Or message",
  "category": "Can't do else!",
  "views": 10000
}
```

Response

```json
{
  "title": "Change title",
  "message": "Or message",
  "category": "default",
  "username": "Test user",
  "id": 1,
  "ownerId": 1,
  "views": 0,
  "createdAt": "2019-08-20T06:49:52.076Z",
  "updatedAt": "2019-08-21T11:50:21.000Z"
}
```

#### DELETE

`Status: 204 No Content`

## /v1/comments/

#### GET

```json
[
  {
    "message": "New message",
    "username": "user",
    "id": 1,
    "userId": 1,
    "postId": 1,
    "createdAt": "2019-08-21T11:52:31.288Z",
    "updatedAt": "2019-08-21T11:52:31.288Z"
  },
  {
    "message": "Another one",
    "username": "Anon",
    "id": 2,
    "userId": 1,
    "postId": 1,
    "createdAt": "2019-08-21T11:54:07.415Z",
    "updatedAt": "2019-08-21T11:54:07.415Z"
  },
  {
    "message": "Keep'em comming!",
    "username": "Chase McDude",
    "id": 3,
    "userId": 4,
    "postId": 1,
    "createdAt": "2019-08-21T11:54:31.162Z",
    "updatedAt": "2019-08-21T11:54:31.162Z"
  }
]
```

#### POST

Body

```json
{
  "userId": 1,
  "postId": 1,
  "message": "New message",
  "username": "user"
}
```

Response

```json
{
  "user": {
    "avatar": "Different avatar",
    "id": 1
  },
  "post": {
    "title": "Change title",
    "message": "Or message",
    "category": "default",
    "username": "Test user",
    "id": 1,
    "ownerId": 1,
    "views": 0,
    "createdAt": "2019-08-20T06:49:52.076Z",
    "updatedAt": "2019-08-21T11:50:21.000Z"
  },
  "message": "New message",
  "username": "user",
  "userId": 1,
  "postId": 1,
  "id": 1,
  "createdAt": "2019-08-21T11:52:31.288Z",
  "updatedAt": "2019-08-21T11:52:31.288Z"
}
```

## /v1/comments/:id

Example: /v1/comments/1

#### GET

```json
{
  "message": "New message",
  "username": "user",
  "id": 1,
  "userId": 1,
  "postId": 1,
  "createdAt": "2019-08-21T11:52:31.288Z",
  "updatedAt": "2019-08-21T11:52:31.288Z"
}
```

#### PUT

Body

```json
{
  "message": "Change message",
  "ASDASD": "Other columns are not cared of!"
}
```

Response

```json
{
  "message": "Change message",
  "username": "user",
  "id": 1,
  "userId": 1,
  "postId": 1,
  "createdAt": "2019-08-21T11:52:31.288Z",
  "updatedAt": "2019-08-21T11:56:32.000Z"
}
```

#### DELETE

`Status: 204 No Content`

## /v1/posts/:id/comments

Example: /v1/posts/1/comments

#### GET

```json
[
  {
    "message": "Change message",
    "username": "user",
    "id": 1,
    "userId": 1,
    "postId": 1,
    "createdAt": "2019-08-21T11:52:31.288Z",
    "updatedAt": "2019-08-21T11:56:32.000Z"
  },
  {
    "message": "Another one",
    "username": "Test user",
    "id": 2,
    "userId": 1,
    "postId": 1,
    "createdAt": "2019-08-21T11:54:07.415Z",
    "updatedAt": "2019-08-21T11:54:07.415Z"
  }
]
```

## /v1/users/

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

Response

```json
{
  "avatar": "New avatar",
  "id": 6
}
```

## /v1/users/:id

Example: /v1/users/1

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

Response

```json
{
  "avatar": "Different avatar",
  "id": 1
}
```

#### DELETE

`Status: 204 No Content`
