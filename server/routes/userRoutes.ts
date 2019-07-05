import express = require('express');
const router = express.Router();
import { User } from '../entities/user';
import { getRepository } from 'typeorm';
import Boom from '@hapi/boom';

const notFound: Boom = new Boom("User doesn't exist", {statusCode: 404});

router.get('/', async (req, res, next) => {
  try {
    const dbusers = await getRepository(User).find();
    res.status(200).send(dbusers);
  } catch (error) {
    next(Boom.boomify(error, {statusCode : 500}));
  }

})

router.get('/:id', async (req, res, next) => {
  try {
    const responce = await getRepository(User).findOne(req.params.id);
    if (responce) {
      res.status(200).send(responce);
    }
    else {
      next(notFound);
    }
  } catch (error) {
    next(Boom.boomify(error, {statusCode : 500}));
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
    next(Boom.boomify(error, {statusCode : 500}));
  }
})

router.delete('/:id', async (req, res, next) => {
  try {
    const deleted = await getRepository(User).delete(req.params.id);
    if (deleted.affected) {
      res.sendStatus(204);
    }
    else {
      next(notFound);
    }

  } catch (error) {
    next(Boom.boomify(error, {statusCode : 500}));
  }

})

// With the limited attributes given to user, only thing they're allowed to change is avatar picture
// Have to explore how sending pictures in url parameters works, but I'm guessing this is a spot where
// picture to base64 needs to be run?
router.put('/:id', async (req, res, next) => {
  try {
    // Make validation that prevents the changing of id.
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
    next(Boom.boomify(error, {statusCode : 500}));
  }


})


module.exports = router;
