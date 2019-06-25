import express = require('express');
import bodyparser = require ('body-parser');

class Post{
  id: number;
  owner: number;
  likes: number;
  category: string;
  views: number;
  message: string;

  constructor(id: number, owner: number, likes: number, category: string, views: number, message: string){
    this.id = id;
    this.owner = owner;
    this.likes = likes;
    this.category = category;
    this.views = views;
    this.message = message;
  }
}


// Create a new express application instance
const app: express.Application = express();
app.use(bodyparser.json());

// Empty array of posts
let posts: Post[] = [];

// Fill posts
for(let i = 0; i<20; i++) {
  posts.push(new Post(i, i, i, "category", i, "toimii"));
}

// Basic message to see that connection works
app.get('/', function (req, res) {
  res.status(200).send('Bulletin_Board');
});

// Return all posts
app.get('/Post', (req, res) => {
  res.status(200).send(posts);
})

// Dummy for post/id
app.get('/Post/:id', (req, res) => {
  res.status(200).send(posts[req.params.id]);
})

// Create post
app.post('/Post', (req, res) => {
  const post : Post = req.body;
  posts.push(post)
  console.log(posts[posts.length-1]);
  res.status(201).send(post);
})

// Delete post
app.delete('/Post/:id', (req, res) => {
  const deleted: Post = posts[req.params.id];
  // Not very optimal to leave holes with null, but splicing changes the positioning for the rest of the array.
  // The problem should disapper when working with a database, with real id's and not indexes.
  delete(posts[deleted.id]);
  res.status(202).send(deleted);

})
// Update post
app.put('/Post/:id', (req, res) => {
  console.log(posts[req.params.id]);
  const updated: Post = req.body;
  posts[req.params.id] = updated;
  console.log(updated);
  res.status(200).send(posts[updated.id]);
})


app.listen(3000, function () {
  console.log('Example app listening on port 3000!');
});
