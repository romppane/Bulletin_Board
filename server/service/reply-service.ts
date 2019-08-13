import { Reply } from '../entities/reply';
import { Dependencies } from '../types';
import { QueryDeepPartialEntity } from 'typeorm/query-builder/QueryPartialEntity';
import { Repository } from 'typeorm';
import { Post } from '../entities/post';
import { User } from '../entities/user';

export class ReplyService {
  // Can't use Repository<Entity>, needs specific?
  // Should the service know all the repositories or get access to services via parameters from controllers?
  replyRepository: Repository<Reply>;
  postRepository: Repository<Post>;
  userRepository: Repository<User>;

  constructor(options: Dependencies) {
    this.replyRepository = options.replyRepository;
    this.postRepository = options.postRepository;
    this.userRepository = options.userRepository;
  }

  find() {
    return this.replyRepository.find();
  }

  findByPost(postId: number) {
    return this.replyRepository.query('SELECT * FROM reply WHERE postId = ?', [postId]);
  }

  findOne(id: number) {
    return this.replyRepository.findOne(id);
  }

  // Fetch user and post first, return the saved reply
  async save(userId: number, postId: number, message: string) {
    try {
      const user = await this.userRepository.findOne(userId);
      const post = await this.postRepository.findOne(postId);
      if (user && post) {
        const reply: Reply = new Reply(user, post, message);
        return this.replyRepository.save(reply);
      } else {
        return undefined;
      }
    } catch (error) {
      return undefined;
    }
  }

  delete(id: number) {
    return this.replyRepository.delete(id);
  }

  update(id: number, obj: QueryDeepPartialEntity<Reply>) {
    return this.replyRepository.update(id, obj).then(() => {
      return this.replyRepository.findOne(id);
    });
  }
}
