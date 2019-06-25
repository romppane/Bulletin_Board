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

  public addView() {
    this.views += 1;
  }

  // With this way of implementing likes, it's impossible to keep track of who likes the post or not.
  // Correct way to do this is probably with an extra table, but if you want to be able to like comments too, it's going to be a hastle!
  // Don't see the feature being the top priority now so I'll just let it be.
  public likePost() {
    this.likes += 1;
  }

  public unlikePost() {
    this.likes -= 1;
  }

  public setCategory(category:string) {
    this.category = category
  }

  public setMessage(message:string) {
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
  let post : Post = posts[req.params.id];
  post.addView();
  res.status(200).send(post);
})

// Create post
app.post('/Post', (req, res) => {
  const post : Post = req.body;
  posts.push(post)
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

 // Update post, change the tittle and/or the message
 app.put('/Post/:id', (req, res) => {
   let updated: Post = posts[req.params.id];
   if(req.body.category) {
     updated.setCategory(req.body.category);
   }
   if(req.body.message) {
     updated.setMessage(req.body.message);
   }
   posts[req.params.id] = updated;
   res.status(200).send(posts[updated.id]);
 })


// Like post
app.put('/Post/:id/like', (req, res) => {
  console.log(posts[req.params.id]);
  let updated: Post = posts[req.params.id];
  updated.likePost();
  res.status(200).send(posts[updated.id]);
})

// Don't like
app.put('/Post/:id/unlike', (req, res) => {
  console.log(posts[req.params.id]);
  let updated: Post = posts[req.params.id];
  updated.unlikePost();
  res.status(200).send(posts[updated.id]);
})


app.listen(3000, function () {
  console.log('Example app listening on port 3000!');
});
