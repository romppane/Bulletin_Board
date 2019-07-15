import 'reflect-metadata';
import * as fs from 'fs';
import * as path from 'path';
import express = require('express');
import { Request, Response } from 'express';
import bodyparser = require('body-parser');
import { registerSchema } from 'class-validator';
import { postPUTSchema, replyPUTSchema, requestParamSchema } from './middleware/validation';
import { handleErrors } from './middleware/errors';
import { PostRouter } from './routes/post-router';
import { Dependencies } from './types';
import { UserRouter } from './routes/user-router';
import { ReplyRouter } from './routes/reply-router';

// It's essential to register schemas. Otherwise all will pass.
registerSchema(postPUTSchema);
registerSchema(replyPUTSchema);
registerSchema(requestParamSchema);

// Construct morgan
const morgan = require('morgan');
const moment = require('moment-timezone');
// Construct routes
const root = require('./routes/root');

export class Server {
  // Create a new express application instance
  app: express.Application;
  postRouter: PostRouter;
  userRouter: UserRouter;
  replyRouter: ReplyRouter;
  constructor(options: Dependencies) {
    this.app = express();
    this.postRouter = options.postRouter;
    this.userRouter = options.userRouter;
    this.replyRouter = options.replyRouter;
  }

  start() {
    morgan.token('date', (req: Request, res: Response, zone: string) => {
      return moment()
        .tz(zone)
        .format();
    });

    // :remote-addr - :remote-user , possibly later
    morgan.format(
      'outFormat',
      ':remote-addr [:date[Europe/Helsinki]] :method [:url] HTTP/:http-version [:status] :res[content-length] - :response-time ms [:user-agent]'
    );
    morgan.format(
      'incFormat',
      ':remote-addr [:date[Europe/Helsinki]] :method [:url] HTTP/:http-version [:user-agent]'
    );

    const infoLogStream = fs.createWriteStream(path.join('.', 'logs', 'info.log'), {
      flags: 'a'
    });

    const errorLogStream = fs.createWriteStream(path.join('.', 'logs', 'error.log'), {
      flags: 'a'
    });

    this.app.use(bodyparser.json());

    // Log incoming requests
    this.app.use(
      morgan('incFormat', {
        immediate: true,
        stream: infoLogStream
      })
    );

    // Log successfull responces
    this.app.use(
      morgan('outFormat', {
        skip: (req: express.Request, res: express.Response) => {
          return res.statusCode >= 399;
        },
        stream: infoLogStream
      })
    );

    // Logs error responces
    this.app.use(
      morgan('outFormat', {
        skip: (req: express.Request, res: express.Response) => {
          return res.statusCode < 400;
        },
        stream: errorLogStream
      })
    );

    // Routing
    this.app.use('/', root);
    this.app.use('/posts', this.postRouter.router);
    this.app.use('/users', this.userRouter.router);
    this.app.use('/comments', this.replyRouter.router);
    // Error handler
    this.app.use(handleErrors);
    this.app.listen(3000, () => {
      console.log('Server listening on 3000');
    });
  }
}
