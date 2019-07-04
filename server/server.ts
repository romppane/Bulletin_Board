import express = require('express');
import bodyparser = require ('body-parser');
import "reflect-metadata";
import { createConnection } from "typeorm";
import { registerSchema } from "class-validator";
import { postPUTSchema } from './helpers/validation';
import { handleErrors } from './helpers/errors';
import * as fs from "fs";
import * as path from "path";
// It's essential to register schemas. Otherwise all will pass.
registerSchema(postPUTSchema);


// Construct routes
const root = require('./routes/root');
const postRoutes = require ('./routes/postRoutes');
const userRoutes = require ('./routes/userRoutes');
const replyRoutes = require ('./routes/replyRoutes');


const moment = require ("moment-timezone");
const morgan = require ("morgan");

morgan.token('date', (req : express.Request, res : express.Response, zone : string) => {
  
  return moment().tz(zone).format()+"";
})


morgan.format('outFormat', ':remote-addr - :remote-user [:date[Europe/Helsinki]]:method|:url|HTTP/:http-version|:status|:res[content-length] - :response-time ms|:user-agent|');
morgan.format('incFormat', ':remote-addr - :remote-user [:date[Europe/Helsinki]]:method|:url|HTTP/:http-version|:user-agent|');

const infoLogStream = fs.createWriteStream(
  path.join('.', 'logs', 'info.log'),
  { flags: 'a' }
);

const errorLogStream = fs.createWriteStream(
  path.join('.', 'logs', 'error.log'),
  { flags: 'a'}
);

// Create a new express application instance
const app: express.Application = express();
app.use(bodyparser.json());

// Log incoming requests
app.use(morgan('incFormat', {
  immediate: true,
  stream: infoLogStream}))

// Log successfull responces
app.use(morgan('outFormat', {skip: (req : express.Request, res : express.Response) => {
  return res.statusCode >= 399
}, stream : infoLogStream}))

// Logs error responces
app.use(morgan('outFormat', {skip: (req : express.Request, res : express.Response) => {
  return res.statusCode < 400
}, stream : errorLogStream}))


// Routing
app.use('/', root);
app.use('/posts', postRoutes);
app.use('/users', userRoutes);
app.use('/posts/:id/comments', replyRoutes);

// Error handler
app.use(handleErrors);

// Log everything that comes out
// app.use(morgan);
// Create db connection
const connection = createConnection();

// Should probably be configurable by config file
app.listen(3000, function () {
  console.log('Bulletin board server listening on port 3000!');
});
