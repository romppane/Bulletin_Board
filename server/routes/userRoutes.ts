import express = require('express');
const router = express.Router();
import { User } from '../entities/user';
import { getRepository } from 'typeorm';
import Boom from '@hapi/boom';
import { validateParams } from '../helpers/validation';

const notFound: Boom = Boom.notFound("User doesn't exist");

router.get('/', async (req, res, next) => {
  try {
    const dbusers = await getRepository(User).find();
    res.status(200).send(dbusers);
  } catch (error) {
    next(Boom.badImplementation());
  }

})

router.get('/:id', validateParams, async (req, res, next) => {
  try {
    const responce = await getRepository(User).findOne(req.params.id);
    if (responce) {
      res.status(200).send(responce);
    }
    else {
      next(notFound);
    }
  } catch (error) {
    next(Boom.badImplementation());
  }
})

router.post('/', async (req, res, next) => {
  // Should probably make the avatar default to ""
  // Using the constructors for now instead of repository.create()
  try {
    const user: User = new User(req.body.avatar);
    await getRepository(User).save(user);
    res.status(201).send(user);
  } catch (error) {
    next(Boom.badImplementation());
  }
})

router.delete('/:id', validateParams, async (req, res, next) => {
  try {
    const deleted = await getRepository(User).delete(req.params.id);
    if (deleted.affected) {
      res.sendStatus(204);
    }
    else {
      next(notFound);
    }

  } catch (error) {
    next(Boom.badImplementation());
  }

})

// With the limited attributes given to user, only thing they're allowed to change is avatar picture
// Have to explore how sending pictures in url parameters works, but I'm guessing this is a spot where
// picture to base64 needs to be run?
router.put('/:id', validateParams, async (req, res, next) => {
  try {
    // Bootleg validator as user has only few fields now and avatar is the only one you can change.
    // When user gets more advaced create proper validation to it! Class-validator can check Base64 encoding for the avatar.
    req.body = {avatar : req.body.avatar};
    await getRepository(User).update(req.params.id, req.body);
    // Not class instance
    const updated = await getRepository(User).findOne(req.params.id);
    if (updated) {
      res.status(200).send(updated);
    }
    else {
      next(notFound);
    }
  } catch (error) {
    next(Boom.badImplementation());
  }


})


module.exports = router;
