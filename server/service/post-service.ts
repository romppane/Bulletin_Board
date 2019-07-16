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

  save(ownerId: number, category: string, message: string, userService: UserService) {
    return userService.findOne(ownerId).then(result => {
      const user = plainToClass(User, result);
      if (user) {
        const post: Post = new Post(user, category, message);
        this.repository.save(post);
        return post;
      } else {
        return undefined;
      }
    });
  }

  delete(id: number) {
    return this.repository.delete(id);
  }

  update(id: number, obj: QueryDeepPartialEntity<Post>) {
    return this.repository.update(id, obj);
  }
}
