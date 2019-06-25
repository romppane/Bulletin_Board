import express = require('express');
import bodyparser = require ('body-parser');

interface Note {
  id: number;
  owner: number;
  likes: number;
  category: string;
  views: number;
  message: string;
}

class Post implements Note{
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
for(var i = 0; i<20; i++) {
  posts.push(new Post(i, i, i, "category", i, "toimii"));
}

// Basic message to see that connection works
app.get('/', function (req, res) {
  res.send('Bulletin_Board');
});

// Return all posts
app.get('/Post', (req, res) => {
  res.send(posts);
})

// Dummy for post/id
app.get('/Post/:id', (req, res) => {
  res.send(posts[req.params.id]);
})

// Create post
app.post('/Post', (req, res) => {
  const post : Post = req.body;
  posts.push(post)
  console.log(posts[posts.length-1]);

  res.sendStatus(200);
})

// Delete post
app.delete('/Post/:id', (req, res) => {
  console.log(posts[req.params.id]);
  res.sendStatus(200);
})
// Update post
app.put('/Post/:id', (req, res) => {
  console.log(posts[req.params.id]);
  res.sendStatus(200);
})


app.listen(3000, function () {
  console.log('Example app listening on port 3000!');
});
