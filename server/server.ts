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
import { Logger } from './middleware/logger';

// It's essential to register schemas. Otherwise all will pass.
registerSchema(postPUTSchema);
registerSchema(replyPUTSchema);
registerSchema(requestParamSchema);

export class Server {
  // Create a new express application instance
  app: express.Application;
  postRouter: PostRouter;
  userRouter: UserRouter;
  replyRouter: ReplyRouter;
  logger: Logger;
  constructor(options: Dependencies) {
    this.app = express();
    this.postRouter = options.postRouter;
    this.userRouter = options.userRouter;
    this.replyRouter = options.replyRouter;
    this.logger = new Logger(this.app);
  }

  start() {
    this.app.use(bodyparser.json());
    // Routing
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
