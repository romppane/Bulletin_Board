import express = require('express');
const router = express.Router();
import {User} from '../entities/user';

let users: User[] = [];

for(let i = 0; i<5; i++) {
  users.push(new User(i, "abcd%d" + i));
}

router.get('/', (req, res) => {
  res.status(200).send(users);
})
module.exports = router;
