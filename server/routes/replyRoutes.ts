import express = require('express');
const router = express.Router();
import { Reply } from '../entities/reply';
import { getRepository } from 'typeorm';
import Boom = require('@hapi/boom');
import { validateReply, validateReplyPUT, validateParams } from '../helpers/validation';
import { User } from '../entities/user';
import { Post } from '../entities/post';

const notFound = Boom.notFound("User doesn't exist");


router.get('/', async (req, res, next) => {
  try {
    const replies = await getRepository(Reply).find();
    res.status(200).send(replies);
  } catch (error) {
    next(Boom.badImplementation());
  }

})

router.get('/:id', validateParams, async (req, res, next) => {
  try {
    const reply = await getRepository(Reply).findOne(req.params.id);
    if (reply) {
      res.status(200).send(reply);
    }
    else {
      next(notFound);
    }
  } catch (error) {
    // in case of an internal error
    next(Boom.badImplementation());
  }

})

router.post('/', validateReply, (req, res, next) => {
    Promise.all([getRepository(User).findOne(req.body.userId), getRepository(Post).findOne(req.body.postId)]).then(results => {
      if(typeof(results[0]) !== "undefined" && typeof(results[1]) !== "undefined"){
        const reply : Reply = new Reply(results[0], results[1], req.body.message);
        getRepository(Reply).save(reply);
        res.status(201).send(reply);
      }
      else {
        next(Boom.notFound())
      }
    }).catch(error => next(Boom.badImplementation()))
  }
)

router.delete('/:id', validateParams, async (req, res, next) => {
  try {
    const deleted = await getRepository(Reply).delete(req.params.id);
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

router.put('/:id', validateParams, validateReplyPUT, async (req, res, next) => {

  try {
    // Validate out any unnecessary fields
    await getRepository(Reply).update(req.params.id, req.body);
    const updated = await getRepository(Reply).findOne(req.params.id);
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

// Putting the liking to freeze for now since a better sort kind of system is on the works in the background!
//Add and delete likes
/*
router.patch('/:id/like', (req,res) => {
  const updated : Reply = replies[req.params.id];
  updated.likeReply();
  res.status(200).send(updated);
})

router.delete('/:id/like', (req,res) => {
  const updated : Reply = replies[req.params.id];
  updated.unlikeReply();
  res.status(200).send(updated);
})
*/
module.exports = router;
