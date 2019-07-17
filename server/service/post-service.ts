import { Dependencies } from '../types';
import { Repository } from 'typeorm';
import { Post } from '../entities/post';
import { User } from '../entities/user';
import { plainToClass } from 'class-transformer';
import { QueryDeepPartialEntity } from 'typeorm/query-builder/QueryPartialEntity';
import { UserService } from './user-service';
// Just a middleman currently?
export class PostService {
  repository: Repository<Post>;

  constructor(options: Dependencies) {
    this.repository = options.postRepository;
  }

  find() {
    return this.repository.find();
  }

  findOne(id: number) {
    return this.repository.findOne(id);
  }

  // Should this get access to service from upperlayer or have access to user repo on its own?
  async save(ownerId: number, category: string, message: string, userService: UserService) {
    try {
      const temp = await userService.findOne(ownerId);
      const user = plainToClass(User, temp);
      if (user) {
        const post: Post = new Post(user, category, message);
        return await this.repository.save(post);
      } else {
        return undefined;
      }
    } catch (error) {
      return undefined;
    }
  }

  delete(id: number) {
    return this.repository.delete(id);
  }

  update(id: number, obj: QueryDeepPartialEntity<Post>) {
    this.repository.update(id, obj);
    return this.repository.findOne(id);
  }
}
