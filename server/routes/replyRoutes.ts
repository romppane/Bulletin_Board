import express = require('express');
const router = express.Router();
import { Reply } from '../entities/reply';
import { getRepository } from 'typeorm';
import Boom = require('@hapi/boom');

const notFound : Boom = new Boom("Comment doesn't exist", {statusCode : 404});

router.get('/', async (req, res, next) => {
  try {
    const replies = await getRepository(Reply).find();
    res.status(200).send(replies);
  } catch (error) {
    next(Boom.boomify(error, {statusCode : 500}));
  }

})

router.get('/:id', async (req, res, next) => {
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
    next(Boom.boomify(error, {statusCode : 500}));
  }

})

router.post('/', async (req, res, next) => {
  try {
    const reply: Reply = new Reply(req.body.user_id, req.body.post_id, req.body.message);
    await getRepository(Reply).save(reply);
    res.status(201).send(reply);
  } catch (error) {
    next(Boom.boomify(error, {statusCode : 500}));
  }

})

router.delete('/:id', async (req, res, next) => {
  try {
    const deleted = await getRepository(Reply).delete(req.params.id);
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

router.put('/:id', async (req, res, next) => {

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
    next(Boom.boomify(error, {statusCode : 500}));
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
