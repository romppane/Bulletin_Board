import express = require('express');
import { Post } from '../entities/post';
import { validatePost, validatePostPUT, validateParams } from '../helpers/validation';
import Boom = require('@hapi/boom');
import { getRepository, Repository } from 'typeorm';
import { User } from '../entities/user';
import { plainToClass } from 'class-transformer';
import { Request, Response, NextFunction } from 'express-serve-static-core';
import { Dependencies } from '../types';

export class PostRouter {
  notFound: Boom;
  router: express.Router;
  postRepository: Repository<Post>
  constructor(options : Dependencies) {
    this.router = express.Router();
    this.notFound = Boom.notFound("Post doesn't exist");
    this.postRepository = options.postRepository
    // Return all posts
    this.router.get('/', async (req: Request, res: Response, next: NextFunction) => {
      try {
        let posts = await this.postRepository.find();
        res.status(200).send(posts);
      } catch (error) {
        next(Boom.badImplementation());
      }
    });

    this.router.get(
      '/:id',
      validateParams,
      async (req: Request, res: Response, next: NextFunction) => {
        try {
          // REMEMBER TO ADD VIEWS
          const post = await this.postRepository.findOne(req.params.id);
          if (post) {
            res.status(200).send(post);
          } else {
            next(this.notFound);
          }
        } catch (error) {
          next(Boom.badImplementation());
        }
      }
    );

    // Create post
    // Now requires user id to make a post...
    this.router.post('/', validatePost, async (req: Request, res: Response, next: NextFunction) => {
      try {
        const user: User = plainToClass(User, await getRepository(User).findOne(req.body.ownerId));
        if (user) {
          const post: Post = new Post(user, req.body.category, req.body.message);
          await this.postRepository.save(post);
          res.status(201).send(post);
        } else {
          next(Boom.notFound("User doesn't exist"));
        }
      } catch (error) {
        next(Boom.badImplementation());
      }
    });

    // Delete post
    this.router.delete(
      '/:id',
      validateParams,
      async (req: Request, res: Response, next: NextFunction) => {
        try {
          const deleted = await this.postRepository.delete(req.params.id);
          if (deleted.affected) {
            res.sendStatus(204);
          } else {
            next(this.notFound);
          }
        } catch (error) {
          next(Boom.badImplementation());
        }
      }
    );

    // Update post, change the tittle and/or the message
    // LETS CHANGE ID
    this.router.put(
      '/:id',
      validateParams,
      validatePostPUT,
      async (req: Request, res: Response, next: NextFunction) => {
        try {
          await this.postRepository.update(req.params.id, req.body);
          const updated = await this.postRepository.findOne(req.params.id);
          if (updated) {
            res.status(200).send(updated);
          } else {
            next(this.notFound);
          }
        } catch (error) {
          next(Boom.badImplementation());
        }
      }
    );
  }
}
