import { PostRouter } from "./routes/postRoutes";
import { Repository } from "typeorm";
import { Post } from "./entities/post";
import { User } from "./entities/user";
import { UserRouter } from "./routes/userRoutes";

export type Dependencies = {
    postRouter : PostRouter,
    postRepository : Repository<Post>,
    userRouter : UserRouter,
    userRepository: Repository<User>
  }