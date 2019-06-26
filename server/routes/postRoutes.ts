import express = require('express');
const router = express.Router();
import {comparePosts} from '../helpers/helpers';
import {Post} from '../entities/post';

// Empty array of posts
let posts: Post[] = [];

// Fill posts
for(let i = 0; i<20; i++) {
  posts.push(new Post(i, i, "category", "toimii"));
}

// Return all posts
router.get('/', (req, res) => {
  res.status(200).send(posts);
})

// Dummy for post/id
router.get('/:id', (req, res) => {
  let post : Post = posts[req.params.id];
  post.addView();
  res.status(200).send(post);
})

// Create post
router.post('/', (req, res) => {
  // Post now using constructor with static id values. Once the project moves on to use db the id's can be auto incremented and fetched from the correct users.
  const post : Post = new Post(100, 100, req.body.category, req.body.message);
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
 router.put('/:id', (req, res) => {
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
router.put('/:id/like', (req, res) => {
  console.log(posts[req.params.id]);
  let updated: Post = posts[req.params.id];
  updated.likePost();
  res.status(200).send(updated);
})

// Don't like
router.put('/:id/unlike', (req, res) => {
  console.log(posts[req.params.id]);
  let updated: Post = posts[req.params.id];
  updated.unlikePost();
  console.log(updated);
  res.status(200).send(updated);
})
module.exports = router;
