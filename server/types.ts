import { PostController } from './controllers/post-controller';
import { Repository } from 'typeorm';
import { Post } from './entities/post';
import { User } from './entities/user';
import { UserController } from './controllers/user-controller';
import { Reply } from './entities/reply';
import { ReplyController } from './controllers/reply-controller';
import { PostService } from './service/post-service';
import { UserService } from './service/user-service';
import { ErrorRequestHandler } from 'express-serve-static-core';
import { Logger } from './middleware/logger';

export type Dependencies = {
  postRouter: PostController;
  postRepository: Repository<Post>;
  postService: PostService;
  userRouter: UserController;
  userRepository: Repository<User>;
  userService: UserService;
  replyRouter: ReplyController;
  replyRepository: Repository<Reply>;
  errorHandler: ErrorRequestHandler;
  logger: Logger;
};
