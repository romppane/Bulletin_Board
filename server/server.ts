import 'reflect-metadata';
import express from 'express';
import cors from 'cors';
import { registerSchema } from 'class-validator';
import { postPUTSchema, commentPUTSchema, requestParamSchema } from './middleware/validation';
import { PostController } from './controllers/post-controller';
import { Dependencies } from './types';
import { UserController } from './controllers/user-controller';
import { CommentController } from './controllers/comment-controller';
import { Logger } from './middleware/logger';
import { ErrorRequestHandler } from 'express-serve-static-core';
import { Environment } from './environment';

// It's essential to register schemas. Otherwise all will pass.
registerSchema(postPUTSchema);
registerSchema(commentPUTSchema);
registerSchema(requestParamSchema);

export class Server {
  // Create a new express application instance
  app: express.Application;
  errorHandler: ErrorRequestHandler;
  postRouter: PostController;
  userRouter: UserController;
  commentRouter: CommentController;
  logger: Logger;
  Env: Environment;
  constructor(options: Dependencies) {
    this.app = express();
    this.postRouter = options.postRouter;
    this.userRouter = options.userRouter;
    this.commentRouter = options.commentRouter;
    this.logger = options.logger;
    this.errorHandler = options.errorHandler;
    this.Env = options.Env;
  }

  start() {
    this.app.use(express.json());
    this.app.use(cors());
    this.app.use(this.logger.incomingRequests());
    this.app.use(this.logger.successfulResponces());
    this.app.use(this.logger.errorResponces());

    // Routing
    this.app.use('/v1/posts', this.postRouter.router);
    this.app.use('/v1/users', this.userRouter.router);
    this.app.use('/v1/comments', this.commentRouter.router);
    // Error handler
    this.app.use(this.errorHandler);
    this.app.listen(this.Env.PORT, () => {
      console.log('Server listening on %s', this.Env.PORT);
    });
  }
}
