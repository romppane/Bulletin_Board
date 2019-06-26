import express = require('express');
import bodyparser = require ('body-parser');



// Construct routes
const root = require('./routes/root');
const postRoutes = require ('./routes/postRoutes');
const userRoutes = require ('./routes/userRoutes');
const replyRoutes = require ('./routes/replyRoutes');


// Create a new express application instance
const app: express.Application = express();
app.use(bodyparser.json());
app.use('/', root);
app.use('/post', postRoutes);
app.use('/user', userRoutes);
app.use('/reply', replyRoutes);

// Should probably be configurable by config file
app.listen(3000, function () {
  console.log('Bulletin board server listening on port 3000!');
});
