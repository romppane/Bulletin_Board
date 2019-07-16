import express from 'express';
import { validatePost, validatePostPUT, validateParams } from '../middleware/validation';
import Boom from '@hapi/boom';
import { Request, Response, NextFunction } from 'express-serve-static-core';
import { Dependencies } from '../types';
import { PostService } from '../service/post-service';
import { UserService } from '../service/user-service';

export class PostController {
  notFound: Boom;
  router: express.Router;
  postService: PostService;
  userService: UserService;
  constructor(options: Dependencies) {
    this.router = express.Router();
    this.notFound = Boom.notFound("Post doesn't exist");
    this.postService = options.postService;
    this.userService = options.userService;
    this.initializeRoutes();
  }

  initializeRoutes() {
    this.router.get('/', this.getAll);
    this.router.get('/:id', validateParams, this.getOne.bind(this));
    this.router.post('/', validatePost, this.post.bind(this));
    this.router.delete('/:id', validateParams, this.delete.bind(this));
    this.router.put('/:id', validateParams, validatePostPUT, this.update.bind(this));
  }

  getAll = async (req: Request, res: Response, next: NextFunction) => {
    try {
      const posts = await this.postService.find();
      res.status(200).send(posts);
    } catch (error) {
      next(Boom.badImplementation());
    }
  };

  async getOne(req: Request, res: Response, next: NextFunction) {
    try {
      const post = await this.postService.findOne(req.params.id);
      if (post) {
        res.status(200).send(post);
      } else {
        next(this.notFound);
      }
    } catch (error) {
      next(Boom.badImplementation());
    }
  }

  // Create post
  async post(req: Request, res: Response, next: NextFunction) {
    try {
      const post = await this.postService.save(
        req.body.ownerId,
        req.body.category,
        req.body.message,
        this.userService
      );
      if (post) {
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
  async update(req: Request, res: Response, next: NextFunction) {
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
