import * as awilix from 'awilix';
import { PostController } from './controllers/post-controller';
import { createConnection, getRepository } from 'typeorm';
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

const connection: any = {
  type: 'mariadb',
  url: process.env.JAWSDB_MARIA_URL,
  database: process.env.DATABASE,
  synchronize: process.env.SYNCHRONIZE,
  logging: process.env.LOGGING,
  entities: process.env.ENTITIES,
  cli: process.env.CLI
};

const container = awilix.createContainer({
  injectionMode: awilix.InjectionMode.PROXY
});

export function configureContainer() {
  return createConnection(connection).then(() => {
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
      app: awilix.asClass(Server)
    });
  });
}
