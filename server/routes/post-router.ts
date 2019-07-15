import express = require('express');
import { Post } from '../entities/post';
import { validatePost, validatePostPUT, validateParams } from '../middleware/validation';
import Boom = require('@hapi/boom');
import { getRepository, Repository } from 'typeorm';
import { User } from '../entities/user';
import { plainToClass } from 'class-transformer';
import { Request, Response, NextFunction } from 'express-serve-static-core';
import { Dependencies } from '../types';
import { PostService } from '../service/post-service';

export class PostRouter {
  notFound: Boom;
  router: express.Router;
  postRepository: Repository<Post>
  postService: PostService;
  constructor(options : Dependencies) {
    this.router = express.Router();
    this.notFound = Boom.notFound("Post doesn't exist");
    this.postRepository = options.postRepository;
    this.postService = options.postService;
    this.initializeRoutes();

    
  }

  initializeRoutes() {
    this.router.get('/', this.getAll.bind(this));
    this.router.get('/:id', validateParams, this.getOne.bind(this));
    this.router.post('/', validatePost, this.post.bind(this));
    this.router.delete('/:id', validateParams, this.delete.bind(this));
    this.router.put('/:id', validateParams, validatePostPUT, this.update.bind(this));
  }



  async getAll(req: Request, res: Response, next: NextFunction) {
    try {
      const posts = await this.postService.find();
      res.status(200).send(posts);
    } catch (error) {
      console.log(error);
      next(Boom.badImplementation());
    }
    
  }

  async getOne(req: Request, res: Response, next: NextFunction) {
    try {
      const post = await this.postService.findOne(req.params.id)
    if(post) {
      res.status(200).send(post);
    }
    else {
      next(this.notFound);
    }
    } catch (error) {
      next(Boom.badImplementation());
    }
    
  }

  // Create post
    async post(req: Request, res: Response, next: NextFunction) {
      try {
        const user: User = plainToClass(User, await getRepository(User).findOne(req.body.ownerId));
        if (user) {
          const post: Post = new Post(user, req.body.category, req.body.message);
          await this.postService.save(post);
          res.status(201).send(post);
        } else {
          next(Boom.notFound("User doesn't exist"));
        }
      } catch (error) {
        next(Boom.badImplementation());
      }
}

async delete(req: Request, res: Response, next: NextFunction) {
    // Delete post
        try {
          const deleted = await this.postService.delete(req.params.id);
          if (deleted.affected) {
            res.sendStatus(204);
          } else {
            next(this.notFound);
          }
        } catch (error) {
          next(Boom.badImplementation());
        }
}
    // Update post, change the tittle and/or the message
    // LETS CHANGE ID
    async update(req: Request, res: Response, next: NextFunction){
        try {
          await this.postService.update(req.params.id, req.body);
          const updated = await this.postService.findOne(req.params.id);
          if (updated) {
            res.status(200).send(updated);
          } else {
            next(this.notFound);
          }
        } catch (error) {
          next(Boom.badImplementation());
        }
}


}
