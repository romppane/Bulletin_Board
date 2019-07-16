import { PostRouter } from './routes/post-router';
import { Repository } from 'typeorm';
import { Post } from './entities/post';
import { User } from './entities/user';
import { UserRouter } from './routes/user-router';
import { Reply } from './entities/reply';
import { ReplyRouter } from './routes/reply-router';
import { PostService } from './service/post-service';
import { UserService } from './service/user-service';
import { ErrorRequestHandler } from 'express-serve-static-core';

export type Dependencies = {
  postRouter: PostRouter;
  postRepository: Repository<Post>;
  postService: PostService;
  userRouter: UserRouter;
  userRepository: Repository<User>;
  userService: UserService;
  replyRouter: ReplyRouter;
  replyRepository: Repository<Reply>;
  errorHandler: ErrorRequestHandler;
};
