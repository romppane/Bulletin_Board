import * as awilix from 'awilix';
import { PostController } from './controllers/post-controller';
import { Post } from './entities/post';
import { Server } from './server';
import { User } from './entities/user';
import { UserController } from './controllers/user-controller';
import { Comment } from './entities/comment';
import { CommentController } from './controllers/comment-controller';
import { PostService } from './service/post-service';
import { UserService } from './service/user-service';
import { handleErrors } from './middleware/errors';
import { Logger } from './middleware/logger';
import { CommentService } from './service/comment-service';
import { Validator } from './middleware/validation';
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
      commentRouter: awilix.asClass(CommentController),
      commentRepository: awilix.asValue(connection.getRepository(Comment)),
      commentService: awilix.asClass(CommentService),
      validator: awilix.asClass(Validator),
      logger: awilix.asClass(Logger),
      Env: awilix.asValue(Env),
      app: awilix.asClass(Server)
    });
  });
}
