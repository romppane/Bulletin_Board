import express = require('express');
const router = express.Router();
import {User} from '../entities/user';
import { getRepository } from 'typeorm';

let users: User[] = [];

for(let i = 0; i<5; i++) {
  users.push(new User("abcd%d" + i));
}

router.get('/', async (req, res) => {
  const dbusers = await getRepository(User).find();
  console.log(dbusers);
  res.status(200).send(dbusers);
})

router.get('/:id', (req, res) => {
  const responce : User = users[req.params.id];
  res.status(200).send(responce);
})

router.post('/', (req,res) => {
  // Should probably make the avatar default to ""
  const user : User = new User(req.body.avatar);
  users.push(user);
  res.status(201).send(user);
})

router.delete('/:id', (req,res) => {
  const deleted : User = users[req.params.id];
  users.splice(req.params.id, 1);
  res.status(202).send(deleted);
})

// With the limited attributes given to user, only thing they're allowed to change is avatar picture
// Have to explore how sending pictures in url parameters works, but I'm guessing this is a spot where
// picture to base64 needs to be run?
router.put('/:id', (req,res) => {
  const updated : User = users[req.params.id];
  if(req.body.avatar) {
    updated.setAvatar(req.body.avatar);
  }
  res.status(200).send(updated);
})


module.exports = router;
