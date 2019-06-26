import express = require('express');
import bodyparser = require ('body-parser');
const root = require('./routes/root');
const postRoutes = require ('./routes/postRoutes');


// Create a new express application instance
const app: express.Application = express();
app.use(bodyparser.json());
app.use('/', root);
app.use('/post', postRoutes);

app.listen(3000, function () {
  console.log('Example app listening on port 3000!');
});
