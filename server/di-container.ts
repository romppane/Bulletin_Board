import * as awilix from 'awilix';
import { PostRouter } from './routes/post-router';
import { createConnection, getRepository } from 'typeorm';
import { Post } from './entities/post';
import { Server } from './server';
import { User } from './entities/user';
import { UserRouter } from './routes/user-router';
import { Reply } from './entities/reply';
import { ReplyRouter } from './routes/reply-router';
import { PostService } from './service/post-service';
import { UserService } from './service/user-service';
import { handleErrors } from './middleware/errors';

const container = awilix.createContainer({
  injectionMode: awilix.InjectionMode.PROXY
});

export function configureContainer() {
  // Add exception handler
  // Start server only if connection established.
  return createConnection().then(() => {
    return container.register({
      errorHandler: awilix.asValue(handleErrors),
      postRouter: awilix.asClass(PostRouter),
      postRepository: awilix.asValue(getRepository(Post)),
      postService: awilix.asClass(PostService),
      userRouter: awilix.asClass(UserRouter),
      userRepository: awilix.asValue(getRepository(User)),
      userService: awilix.asClass(UserService),
      replyRouter: awilix.asClass(ReplyRouter),
      replyRepository: awilix.asValue(getRepository(Reply)),
      app: awilix.asClass(Server)
    });
  });
}
