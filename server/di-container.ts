import * as awilix from 'awilix';
import { PostController } from './controllers/post-controller';
import { Post } from './entities/post';
import { Server } from './server';
import { User } from './entities/user';
import { UserController } from './controllers/user-controller';
import { Reply } from './entities/reply';
import { ReplyController } from './controllers/reply-controller';
import { PostService } from './service/post-service';
import { UserService } from './service/user-service';
import { handleErrors } from './middleware/errors';
import { Logger } from './middleware/logger';
import { ReplyService } from './service/reply-service';
import {
  validatePost,
  validatePostPUT,
  validateParams,
  validateReply,
  validateReplyPUT
} from './middleware/validation';
import { connectDB } from './db';
import { Environment } from './environment';

const container = awilix.createContainer({
  injectionMode: awilix.InjectionMode.PROXY
});

export function configureContainer(Env: Environment) {
  return connectDB(Env).then(connection => {
    return container.register({
      errorHandler: awilix.asValue(handleErrors),
      postRouter: awilix.asClass(PostController),
      postRepository: awilix.asValue(connection.getRepository(Post)),
      postService: awilix.asClass(PostService),
      userRouter: awilix.asClass(UserController),
      userRepository: awilix.asValue(connection.getRepository(User)),
      userService: awilix.asClass(UserService),
      replyRouter: awilix.asClass(ReplyController),
      replyRepository: awilix.asValue(connection.getRepository(Reply)),
      replyService: awilix.asClass(ReplyService),
      validatePost: awilix.asValue(validatePost),
      validatePostPUT: awilix.asValue(validatePostPUT),
      validateParams: awilix.asValue(validateParams),
      validateReply: awilix.asValue(validateReply),
      validateReplyPUT: awilix.asValue(validateReplyPUT),
      logger: awilix.asClass(Logger),
      Env: awilix.asValue(Env),
      app: awilix.asClass(Server)
    });
  });
}
