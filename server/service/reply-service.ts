import { Reply } from '../entities/reply';
import { Dependencies } from '../types';
import { QueryDeepPartialEntity } from 'typeorm/query-builder/QueryPartialEntity';

export class ReplyService {
  // Can't use Repository<Entity>, needs specific?
  // Should the service know all the repositories or get access to services via parameters from controllers?
  repositories: any;
  constructor(options: Dependencies) {
    this.repositories = {
      reply: options.replyRepository,
      post: options.postRepository,
      user: options.userRepository
    };
  }

  find() {
    return this.repositories.reply.find();
  }

  findOne(id: number) {
    return this.repositories.reply.findOne(id);
  }

  // Fetch user and post first, return the saved reply
  save(userId: number, postId: number, message: string) {
    return Promise.all([
      this.repositories.user.findOne(userId),
      this.repositories.post.findOne(postId)
    ])
      .then(([user, post]) => {
        if (user && post) {
          const reply: Reply = new Reply(user, post, message);
          return this.repositories.reply.save(reply);
        } else {
          return undefined;
        }
      })
      .catch(error => {
        return undefined;
      });
  }

  delete(id: number) {
    return this.repositories.reply.delete(id);
  }

  update(id: number, obj: QueryDeepPartialEntity<Reply>) {
    return this.repositories.reply.update(id, obj).then(() => {
      return this.repositories.reply.findOne(id);
    });
  }
}
