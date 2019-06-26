"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var express = require("express");
var bodyparser = require("body-parser");
var helpers_1 = require("./helpers");
// Create a new express application instance
var app = express();
app.use(bodyparser.json());
var Post = /** @class */ (function () {
    function Post(id, owner_id, category, message) {
        this.id = id;
        this.owner_id = owner_id;
        this.likes = 0;
        this.category = category;
        this.views = 0;
        this.message = message;
    }
    Post.prototype.getId = function () {
        return this.id;
    };
    Post.prototype.getOwner_id = function () {
        return this.owner_id;
    };
    Post.prototype.addView = function () {
        this.views += 1;
    };
    Post.prototype.getViews = function () {
        return this.views;
    };
    // With this way of implementing likes, it's impossible to keep track of who likes the post or not.
    // Correct way to do this is probably with an extra table, but if you want to be able to like comments too, it's going to be a hastle!
    // Don't see the feature being the top priority now so I'll just let it be.
    Post.prototype.likePost = function () {
        this.likes += 1;
    };
    Post.prototype.unlikePost = function () {
        this.likes -= 1;
    };
    Post.prototype.getLikes = function () {
        return this.likes;
    };
    Post.prototype.setCategory = function (category) {
        this.category = category;
    };
    Post.prototype.getCategory = function () {
        return this.category;
    };
    Post.prototype.setMessage = function (message) {
        this.message = message;
    };
    Post.prototype.getMessage = function () {
        return this.message;
    };
    return Post;
}());
exports.Post = Post;
// Empty array of posts
var posts = [];
// Fill posts
for (var i = 0; i < 20; i++) {
    posts.push(new Post(i, i, "category", "toimii"));
}
// Basic message to see that the connection works
app.get('/', function (req, res) {
    res.status(200).send('Bulletin_Board');
});
// Return all posts
app.get('/Post', function (req, res) {
    res.status(200).send(posts);
});
// Dummy for post/id
app.get('/Post/:id', function (req, res) {
    var post = posts[req.params.id];
    post.addView();
    res.status(200).send(post);
});
// Create post
app.post('/Post', function (req, res) {
    // Post now using constructor with static id values. Once the project moves on to use db the id's can be auto incremented and fetched from the correct users.
    var post = new Post(100, 100, req.body.category, req.body.message);
    posts.push(post);
    res.status(201).send(post);
});
// Delete post
app.delete('/Post/:id', function (req, res) {
    var deleted = posts[req.params.id];
    // Not very optimal to leave holes with null, but splicing changes the positioning for the rest of the array.
    // The problem should disapper when working with a database, with real id's and not indexes.
    // Now compares objects and removes the matching one
    posts = posts.filter(function (post) { return !helpers_1.comparePosts(post, deleted); });
    res.status(202).send(deleted);
});
// Update post, change the tittle and/or the message
app.put('/Post/:id', function (req, res) {
    var updated = posts[req.params.id];
    if (req.body.category) {
        updated.setCategory(req.body.category);
    }
    if (req.body.message) {
        updated.setMessage(req.body.message);
    }
    posts[req.params.id] = updated;
    res.status(200).send(updated);
});
// Like post
app.put('/Post/:id/like', function (req, res) {
    console.log(posts[req.params.id]);
    var updated = posts[req.params.id];
    updated.likePost();
    res.status(200).send(updated);
});
// Don't like
app.put('/Post/:id/unlike', function (req, res) {
    console.log(posts[req.params.id]);
    var updated = posts[req.params.id];
    updated.unlikePost();
    console.log(updated);
    res.status(200).send(updated);
});
app.listen(3000, function () {
    console.log('Example app listening on port 3000!');
});
