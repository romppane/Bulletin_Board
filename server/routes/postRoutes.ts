import express = require('express');
const router = express.Router();
import {comparePosts, limitResponces, sortBy} from '../helpers/helpers';
import {Post} from '../entities/post';
import { validatePost, validatePostPUT, validateParams } from '../helpers/validation';
import Boom = require('@hapi/boom');
import { getRepository } from 'typeorm';
import { User } from '../entities/user';
import { plainToClass } from 'class-transformer';
import { Like } from '../entities/like';
import { Reply } from '../entities/reply';

const notFound : Boom = Boom.notFound("Post doesn't exist");

// Return all posts
router.get('/', async (req, res, next) => {
  try {
    let posts = await getRepository(Post).find();
    res.status(200).send(posts);
  } catch (error) {
    next(Boom.badImplementation());
  }
})


router.get('/:id', validateParams, async (req, res, next) => {
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
  next(Boom.badImplementation());
}

})

// Create post
// Now requires user id to make a post...
router.post('/:id', validateParams, validatePost, async (req, res, next) => {
  try {
    const user : User = plainToClass(User, await getRepository(User).findOne(req.params.id));
    if(user) {
      const post : Post = new Post(user, req.body.category, req.body.message);
      await getRepository(Post).save(post);
      res.status(201).send(post);
    }
    else {
      next(Boom.notFound("User doesn't exist"));
    }
  } catch (error) {
    next(Boom.badImplementation());
  }
})

// Delete post
router.delete('/:id', validateParams, async (req, res, next) => {
  try {
    const deleted = await getRepository(Post).delete(req.params.id);
    if(deleted.affected) {
      res.sendStatus(204);
    }
    else {
      next(notFound);
    }
  } catch (error) {
    next(Boom.badImplementation());
  }
})

 // Update post, change the tittle and/or the message
 // LETS CHANGE ID
 router.put('/:id', validateParams, validatePostPUT, async (req, res, next) => {
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
     next(Boom.badImplementation());
   }
 })


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