import express = require('express');
import bodyparser = require ('body-parser');
import "reflect-metadata";
import { registerSchema } from "class-validator";
import { postPUTSchema } from './helpers/validation'

// It's essential to register schemas. Otherwise all will pass.
registerSchema(postPUTSchema);



// Construct routes
const root = require('./routes/root');
const postRoutes = require ('./routes/postRoutes');
const userRoutes = require ('./routes/userRoutes');
const replyRoutes = require ('./routes/replyRoutes');


// Create a new express application instance
const app: express.Application = express();
app.use(bodyparser.json());
app.use('/', root);
app.use('/posts', postRoutes);
app.use('/users', userRoutes);
app.use('/posts/:id/comments', replyRoutes);

// Should probably be configurable by config file
app.listen(3000, function () {
  console.log('Bulletin board server listening on port 3000!');
});
