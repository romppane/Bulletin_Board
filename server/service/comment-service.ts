import { Comment } from '../entities/comment';
import { Dependencies } from '../types';
import { QueryDeepPartialEntity } from 'typeorm/query-builder/QueryPartialEntity';
import { Repository } from 'typeorm';
import { Post } from '../entities/post';
import { User } from '../entities/user';

export class CommentService {
  // Can't use Repository<Entity>, needs specific?
  // Should the service know all the repositories or get access to services via parameters from controllers?
  commentRepository: Repository<Comment>;
  postRepository: Repository<Post>;
  userRepository: Repository<User>;

  constructor(options: Dependencies) {
    this.commentRepository = options.commentRepository;
    this.postRepository = options.postRepository;
    this.userRepository = options.userRepository;
  }

  find() {
    return this.commentRepository.find();
  }

  findByPost(postId: number) {
    return this.commentRepository.find({ where: { postId: postId } });
  }

  findOne(id: number) {
    return this.commentRepository.findOne(id);
  }

  // Fetch user and post first, return the saved comment
  async save(userId: number, postId: number, message: string, username: string) {
    try {
      const user = await this.userRepository.findOne(userId);
      const post = await this.postRepository.findOne(postId);
      if (user && post) {
        const comment: Comment = new Comment(user, post, message, username);
        return this.commentRepository.save(comment);
      } else {
        return undefined;
      }
    } catch (error) {
      return undefined;
    }
  }

  delete(id: number) {
    return this.commentRepository.delete(id);
  }

  update(id: number, obj: QueryDeepPartialEntity<Comment>) {
    return this.commentRepository.update(id, obj).then(() => {
      return this.commentRepository.findOne(id);
    });
  }
}
