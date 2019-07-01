import express = require('express');
const router = express.Router();
import { User } from '../entities/user';
import { getRepository } from 'typeorm';

router.get('/', async (req, res) => {
  const dbusers = await getRepository(User).find();
  console.log(dbusers);
  res.status(200).send(dbusers);
})

router.get('/:id', async (req, res) => {
  const responce = await getRepository(User).findOne(req.params.id);
  res.status(200).send(responce);
})

router.post('/', async (req, res) => {
  // Should probably make the avatar default to ""
  // Using the constructors for now instead of repository.create()
  const user: User = new User(req.body.avatar);
  await getRepository(User).save(user);
  res.status(201).send(user);
})

router.delete('/:id', async (req, res) => {
  const deleted = await getRepository(User).delete(req.params.id);
  if (deleted.affected) {
    res.sendStatus(204);
  }
  else {
    // Come up with something better than deleted promise.
    res.status(404).send(deleted);
  }

})

// With the limited attributes given to user, only thing they're allowed to change is avatar picture
// Have to explore how sending pictures in url parameters works, but I'm guessing this is a spot where
// picture to base64 needs to be run?
router.put('/:id', async (req, res) => {
  try {
    // Make validation that prevents the changing of id.
    await getRepository(User).update(req.params.id, req.body);
    // Not class instance
    const updated = await getRepository(User).findOne(req.params.id);
    if (updated) {
      res.status(200).send(updated);
    }
    else {
      res.status(404).send({
        message: "User not found"
      });
    }
  } catch (error) {
    console.log(error);
    res.send(error);
  }


})


module.exports = router;
