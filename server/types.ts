import { PostRouter } from "./routes/postRoutes";
import { Repository } from "typeorm";
import { Post } from "./entities/post";
import { User } from "./entities/user";
import { UserRouter } from "./routes/userRoutes";
import { Reply } from "./entities/reply";
import { ReplyRouter } from "./routes/replyRoutes";

export type Dependencies = {
    postRouter : PostRouter,
    postRepository : Repository<Post>,
    userRouter : UserRouter,
    userRepository: Repository<User>,
    replyRouter: ReplyRouter,
    replyRepository: Repository<Reply>
  }