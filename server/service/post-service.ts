import { Dependencies } from '../types';
import { Repository } from 'typeorm';
import { Post, Categories } from '../entities/post';
import { User } from '../entities/user';
import { plainToClass } from 'class-transformer';
import { QueryDeepPartialEntity } from 'typeorm/query-builder/QueryPartialEntity';

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

  async save(ownerId: number, tittle: string, message: string, category: Categories) {
    try {
      const temp = await this.userRepository.findOne(ownerId);
      const user = plainToClass(User, temp);
      if (user) {
        const post: Post = new Post(user, tittle, message, category);
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
    return this.repository.update(id, obj).then(() => {
      return this.repository.findOne(id);
    });
  }
}
