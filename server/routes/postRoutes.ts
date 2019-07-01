import express = require('express');
const router = express.Router();
import {comparePosts, limitResponces, sortBy} from '../helpers/helpers';
import {Post} from '../entities/post';
import { validatePost, validatePostPUT } from '../helpers/validation';

// Empty array of posts
let posts: Post[] = [];

// Fill posts
for(let i = 0; i<20; i++) {
  posts.push(new Post(i, i, "category", "toimii"));
}

// Return all posts
router.get('/', (req, res) => {
  let responce = posts;
  // parseInt to check if req.query.limit starts with a number
  // Should probably come up with a better way to see what parameters have been set and do the parsing elsewhere?
  if(parseInt(req.query.limit)) {
    responce = limitResponces(responce, parseInt(req.query.limit));
  }
  if(req.query.sort && req.query.field) {
    responce = sortBy(responce, req.query.field.toLowerCase(), req.query.sort.toLowerCase());
  }
  //console.log(responce);
  res.status(200).send(responce);
})

// Dummy for post/id
router.get('/:id', (req, res) => {
  const post : Post = posts[req.params.id];
  // !!! GET SHOULD NEVER CHANGE THE OBJECTS !!!
  post.addView();
  res.status(200).send(post);
})

// Create post
router.post('/', validatePost, (req, res) => {
  // Post now using constructor with static id values. Once the project moves on to use db the id's can be auto incremented and fetched from the correct users.
  console.log(req.body);
  const post : Post = req.body;
  posts.push(post)
  res.status(201).send(post);
})

// Delete post
router.delete('/:id', (req, res) => {
  const deleted: Post = posts[req.params.id];
  // Not very optimal to leave holes with null, but splicing changes the positioning for the rest of the array.
  // The problem should disapper when working with a database, with real id's and not indexes.

  // Now compares objects and removes the matching one (same can be achieved with splice)
  posts = posts.filter((post) => !comparePosts(post, deleted));
  res.status(202).send(deleted);

})

 // Update post, change the tittle and/or the message
 router.put('/:id', validatePostPUT, (req, res) => {
   let updated: Post = posts[req.params.id];
   if(req.body.category) {
     updated.setCategory(req.body.category);
   }
   if(req.body.message) {
     updated.setMessage(req.body.message);
   }
   posts[req.params.id] = updated;
   res.status(200).send(updated);
 })


// Like post
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
module.exports = router;
