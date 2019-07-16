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

const container = awilix.createContainer({
  injectionMode: awilix.InjectionMode.PROXY
});

export function configureContainer() {
  // Add exception handler
  // Start server only if connection established.
  return createConnection().then(() => {
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
      logger: awilix.asClass(Logger),
      app: awilix.asClass(Server)
    });
  });
}
