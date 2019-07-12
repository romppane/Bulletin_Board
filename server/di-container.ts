import * as awilix from 'awilix';
import { PostRouter } from './routes/postRoutes';
import { createConnection, getRepository } from 'typeorm';
import { Post } from './entities/post';
import { Server } from './server';
import { User } from './entities/user';
import { UserRouter } from './routes/userRoutes';
import { Reply } from './entities/reply';
import { ReplyRouter } from './routes/replyRoutes';

const container = awilix.createContainer({
    injectionMode: awilix.InjectionMode.PROXY
})

export function configureContainer() {
    
    // Add exception handler
    // Start server only if connection established.
    return createConnection()
      .then(() => {
        return container.register({
            postRouter: awilix.asClass(PostRouter),
            postRepository: awilix.asValue(getRepository(Post)),
            userRouter: awilix.asClass(UserRouter),
            userRepository: awilix.asValue(getRepository(User)),
            replyRouter: awilix.asClass(ReplyRouter),
            replyRepository: awilix.asValue(getRepository(Reply)),
            app: awilix.asClass(Server)
        })
      })
  }


