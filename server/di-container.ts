import * as awilix from 'awilix';
import { PostController } from './controllers/post-controller';
import { getRepository } from 'typeorm';
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
import { connectDB, Environment } from './db';
import { plainToClass } from 'class-transformer';

const container = awilix.createContainer({
  injectionMode: awilix.InjectionMode.PROXY
});

export function configureContainer() {
  return connectDB().then(() => {
    return container.register({
      errorHandler: awilix.asValue(handleErrors),
      postRouter: awilix.asClass(PostController),
      postRepository: awilix.asValue(getRepository(Post)),
      postService: awilix.asClass(PostService),
      userRouter: awilix.asClass(UserController),
      userRepository: awilix.asValue(getRepository(User)),
      userService: awilix.asClass(UserService),
      replyRouter: awilix.asClass(ReplyController),
      replyRepository: awilix.asValue(getRepository(Reply)),
      replyService: awilix.asClass(ReplyService),
      validatePost: awilix.asValue(validatePost),
      validatePostPUT: awilix.asValue(validatePostPUT),
      validateParams: awilix.asValue(validateParams),
      validateReply: awilix.asValue(validateReply),
      validateReplyPUT: awilix.asValue(validateReplyPUT),
      logger: awilix.asClass(Logger),
      Env: awilix.asValue(
        plainToClass(Environment, {
          DB_URL: process.env.DB_URL,
          DB_NAME: process.env.DB_NAME,
          DB_SYNCHRONIZE: process.env.DB_SYNCHRONIZE,
          DB_LOGGING: process.env.DB_LOGGING,
          DB_ENTITIES: process.env.DB_ENTITIES,
          PORT: process.env.PORT
        })
      ),
      app: awilix.asClass(Server)
    });
  });
}
