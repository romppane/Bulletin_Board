import express from 'express';
import Boom from '@hapi/boom';
import { Request, Response, NextFunction, RequestHandler } from 'express-serve-static-core';
import { Dependencies } from '../types';
import { PostService } from '../service/post-service';
<<<<<<< HEAD
import { CommentService } from '../service/comment-service';
=======
>>>>>>> 286958d31fb3be37413b3edca246bfa334a690e4

export class PostController {
  notFound: Boom;
  router: express.Router;
  postService: PostService;
<<<<<<< HEAD
  commentService: CommentService;
=======
>>>>>>> 286958d31fb3be37413b3edca246bfa334a690e4
  validatePost: RequestHandler;
  validatePostPUT: RequestHandler;
  validateParams: RequestHandler;
  constructor(options: Dependencies) {
    this.router = express.Router();
    this.notFound = Boom.notFound("Post doesn't exist");
    this.postService = options.postService;
<<<<<<< HEAD
    this.commentService = options.commentService;
=======
>>>>>>> 286958d31fb3be37413b3edca246bfa334a690e4
    this.validatePost = options.validatePost;
    this.validatePostPUT = options.validatePostPUT;
    this.validateParams = options.validateParams;
    this.initializeRoutes();
  }

  initializeRoutes() {
    this.router.get('/', this.readAll);
    this.router.get('/:id', this.validateParams, this.readOne);
    this.router.get('/:id/comments', this.validateParams, this.readPostComments);
    this.router.post('/', this.validatePost, this.create);
    this.router.delete('/:id', this.validateParams, this.delete);
    this.router.put('/:id', this.validateParams, this.validatePostPUT, this.update);
  }

  readAll = async (req: Request, res: Response, next: NextFunction) => {
    try {
      const posts = await this.postService.find();
      res.status(200).send(posts);
    } catch (error) {
      next(Boom.badImplementation());
    }
  };

  readOne = async (req: Request, res: Response, next: NextFunction) => {
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
  };

  readPostComments = async (req: Request, res: Response, next: NextFunction) => {
    try {
      const comments = await this.commentService.findByPost(req.params.id);
      res.status(200).send(comments);
    } catch (error) {
      next(Boom.badImplementation());
    }
  };

  create = async (req: Request, res: Response, next: NextFunction) => {
    try {
      const post = await this.postService.save(
        req.body.ownerId,
        req.body.category,
        req.body.header,
        req.body.message
      );
      if (post) {
        res.status(201).send(post);
      } else {
        next(Boom.notFound("User doesn't exist"));
      }
    } catch (error) {
      next(Boom.badImplementation());
    }
  };

  delete = async (req: Request, res: Response, next: NextFunction) => {
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
  };

  // Update post, change the tittle and/or the message
  update = async (req: Request, res: Response, next: NextFunction) => {
    try {
      const updated = await this.postService.update(req.params.id, req.body);
      if (updated) {
        res.status(200).send(updated);
      } else {
        next(this.notFound);
      }
    } catch (error) {
      next(Boom.badImplementation());
    }
  };
}
