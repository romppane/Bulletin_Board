import { PostController } from './controllers/post-controller';
import { Repository } from 'typeorm';
import { Post } from './entities/post';
import { User } from './entities/user';
import { UserController } from './controllers/user-controller';
import { Comment } from './entities/comment';
import { CommentController } from './controllers/comment-controller';
import { PostService } from './service/post-service';
import { UserService } from './service/user-service';
import { ErrorRequestHandler } from 'express-serve-static-core';
import { Logger } from './middleware/logger';
import { CommentService } from './service/comment-service';
import { Environment } from './environment';
import { Validator } from './middleware/validation';

export type Dependencies = {
  postRouter: PostController;
  postRepository: Repository<Post>;
  postService: PostService;
  userRouter: UserController;
  userRepository: Repository<User>;
  userService: UserService;
  commentRouter: CommentController;
  commentRepository: Repository<Comment>;
  commentService: CommentService;
  errorHandler: ErrorRequestHandler;
  validator: Validator;
  logger: Logger;
  Env: Environment;
};
