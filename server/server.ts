import 'reflect-metadata';
import express from 'express';
import { registerSchema } from 'class-validator';
import { postPUTSchema, replyPUTSchema, requestParamSchema } from './middleware/validation';
import { PostController } from './controllers/post-controller';
import { Dependencies } from './types';
import { UserController } from './controllers/user-controller';
import { ReplyController } from './controllers/reply-controller';
import { Logger } from './middleware/logger';
import { ErrorRequestHandler } from 'express-serve-static-core';

// It's essential to register schemas. Otherwise all will pass.
registerSchema(postPUTSchema);
registerSchema(replyPUTSchema);
registerSchema(requestParamSchema);

export class Server {
  // Create a new express application instance
  app: express.Application;
  errorHandler: ErrorRequestHandler;
  postRouter: PostController;
  userRouter: UserController;
  replyRouter: ReplyController;
  logger: Logger;
  constructor(options: Dependencies) {
    this.app = express();
    this.postRouter = options.postRouter;
    this.userRouter = options.userRouter;
    this.replyRouter = options.replyRouter;
    this.logger = options.logger;
    this.errorHandler = options.errorHandler;
  }

  start() {
    this.app.use(express.json());
    this.app.use(this.logger.incomingRequests());
    this.app.use(this.logger.successfulResponces());
    this.app.use(this.logger.errorResponces());

    // Routing
    this.app.use('/posts', this.postRouter.router);
    this.app.use('/users', this.userRouter.router);
    this.app.use('/comments', this.replyRouter.router);
    // Error handler
    this.app.use(this.errorHandler);
    this.app.listen(process.env.PORT || 3000, () => {
      console.log('Server listening on 3000');
    });
  }
}
