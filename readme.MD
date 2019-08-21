# Bulletin Board

RESTful API for bulletin board web application.

[Checkout the UI Repository too!](https://github.com/romppane/Bulletin_Board_UI)

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
[
  {
    "title": "Tittle",
    "message": "Cool!",
    "category": "default",
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
  "ownerId": 1
}
```

Responce

```json
{
  "user": {
    "avatar": "Different avatar",
    "id": 1
  },
  "title": "Sunny day!",
  "message": "Nice weather!",
  "category": "other",
  "ownerId": 1,
  "id": 4,
  "views": 0,
  "createdAt": "2019-08-21T11:44:42.809Z",
  "updatedAt": "2019-08-21T11:44:42.809Z"
}
```

## /posts/:id

Example: /posts/1

#### GET

```json
{
  "title": "Tittle",
  "message": "Cool!",
  "category": "default",
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

Responce

```json
{
  "title": "Change title",
  "message": "Or message",
  "category": "default",
  "id": 1,
  "ownerId": 1,
  "views": 0,
  "createdAt": "2019-08-20T06:49:52.076Z",
  "updatedAt": "2019-08-21T11:50:21.000Z"
}
```

#### DELETE

`Status: 204 No Content`

## /comments/

#### GET

```json
[
  {
    "message": "New message",
    "id": 1,
    "userId": 1,
    "postId": 1,
    "createdAt": "2019-08-21T11:52:31.288Z",
    "updatedAt": "2019-08-21T11:52:31.288Z"
  },
  {
    "message": "Another one",
    "id": 2,
    "userId": 1,
    "postId": 1,
    "createdAt": "2019-08-21T11:54:07.415Z",
    "updatedAt": "2019-08-21T11:54:07.415Z"
  },
  {
    "message": "Keep'em comming!",
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
  "message": "New message"
}
```

Responce

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
    "id": 1,
    "ownerId": 1,
    "views": 0,
    "createdAt": "2019-08-20T06:49:52.076Z",
    "updatedAt": "2019-08-21T11:50:21.000Z"
  },
  "message": "New message",
  "userId": 1,
  "postId": 1,
  "id": 1,
  "createdAt": "2019-08-21T11:52:31.288Z",
  "updatedAt": "2019-08-21T11:52:31.288Z"
}
```

## /comments/:id

Example: /comments/1

#### GET

```json
{
  "message": "New message",
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

Responce

```json
{
  "message": "Change message",
  "id": 1,
  "userId": 1,
  "postId": 1,
  "createdAt": "2019-08-21T11:52:31.288Z",
  "updatedAt": "2019-08-21T11:56:32.000Z"
}
```

#### DELETE

`Status: 204 No Content`

## /posts/:id/comments

Example: /posts/1/comments

#### GET

```json
[
  {
    "message": "Change message",
    "id": 1,
    "userId": 1,
    "postId": 1,
    "createdAt": "2019-08-21T11:52:31.288Z",
    "updatedAt": "2019-08-21T11:56:32.000Z"
  },
  {
    "message": "Another one",
    "id": 2,
    "userId": 1,
    "postId": 1,
    "createdAt": "2019-08-21T11:54:07.415Z",
    "updatedAt": "2019-08-21T11:54:07.415Z"
  }
]
```
