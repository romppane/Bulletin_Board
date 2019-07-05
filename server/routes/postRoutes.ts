import express = require('express');
const router = express.Router();
import {comparePosts, limitResponces, sortBy} from '../helpers/helpers';
import {Post} from '../entities/post';
import { validatePost, validatePostPUT, validateParams } from '../helpers/validation';
import Boom = require('@hapi/boom');
import { getRepository } from 'typeorm';

const notFound : Boom = new Boom("Post doesn't exist", {statusCode : 404});

// Return all posts
router.get('/', async (req, res, next) => {
  try {
    let posts = await getRepository(Post).find();
    res.status(200).send(posts);
  } catch (error) {
    next(Boom.boomify(error, {statusCode: 500}));
  }
})


router.get('/:id', async (req, res, next) => {
try {
  // REMEMBER TO ADD VIEWS
  const post = await getRepository(Post).findOne(req.params.id)
  if(post) {
    res.status(200).send(post);
  }
  else {
    next(notFound);
  }
} catch (error) {
  next(Boom.boomify(error, {statusCode: 500}));
}

})

// Create post
router.post('/', validatePost, async (req, res, next) => {
  try {
    const post : Post = new Post(req.body.owner_id, req.body.category, req.body.message);
    await getRepository(Post).save(post);
    res.status(201).send(post);
  } catch (error) {
    next(Boom.boomify(error, {statusCode: 500}));
  }
})

// Delete post
router.delete('/:id', async (req, res, next) => {
  try {
    const deleted = await getRepository(Post).delete(req.params.id);
    if(deleted.affected) {
      res.sendStatus(204);
    }
    else {
      next(notFound);
    }
  } catch (error) {
    next(Boom.boomify(error, {statusCode: 500}));
  }
})

 // Update post, change the tittle and/or the message
 // LETS CHANGE ID
 router.put('/:id', validatePostPUT, async (req, res, next) => {
   try {
     await getRepository(Post).update(req.params.id, req.body);
     const updated = await getRepository(Post).findOne(req.params.id);
     if(updated) {
       res.status(200).send(updated);
     }
     else {
       next(notFound);
     }
   } catch (error) {
     next(Boom.boomify(error, {statusCode: 500}));
   }
 })


// Like post
/*
router.patch('/:id/like', (req, res) => {
  let updated: Post = posts[req.params.id];
  updated.likePost();
  res.status(200).send(updated);
})

// Don't like
router.delete('/:id/like', (req, res) => {
  let updated: Post = posts[req.params.id];
  updated.unlikePost();
  res.status(200).send(updated);
})
*/
module.exports = router;


/*
  Skeleton of old sorting, f
let responce = posts;
  // parseInt to check if req.query.limit starts with a number
  // Should probably come up with a better way to see what parameters have been set and do the parsing elsewhere?
  if(parseInt(req.query.limit)) {
    responce = limitResponces(responce, parseInt(req.query.limit));
  }
  if(req.query.sort && req.query.field) {
    responce = sortBy(responce, req.query.field.toLowerCase(), req.query.sort.toLowerCase());
  }
  */