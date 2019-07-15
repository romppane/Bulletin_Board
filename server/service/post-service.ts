import { Dependencies } from '../types';
import { Repository } from 'typeorm';
import { Post } from '../entities/post';
import { User } from '../entities/user';
import { plainToClass } from 'class-transformer';
// Just a middleman currently?
export class PostService {
  repository: Repository<Post>;
  userRepository: Repository<User>;

  constructor(options: Dependencies) {
    this.repository = options.postRepository;
    this.userRepository = options.userRepository;
  }

  find() {
    return this.repository.find();
  }

  findOne(id: number) {
    return this.repository.findOne(id);
  }

  async save(ownerId: number, category: string, message: string) {
    try {
      const user: User = plainToClass(User, await this.userRepository.findOne(ownerId));
      if (user) {
        const post: Post = new Post(user, category, message);
        this.repository.save(post);
        return 'success';
      } else {
        return 'not found';
      }
    } catch (error) {
      return 'error';
    }
  }

  delete(id: number) {
    return this.repository.delete(id);
  }

  update(id: number, obj: Object) {
    return this.repository.update(id, obj);
  }
}
