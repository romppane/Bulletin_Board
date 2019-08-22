import express from 'express';
import Boom from '@hapi/boom';
import { Dependencies } from '../types';
import { Request, Response, NextFunction, RequestHandler } from 'express-serve-static-core';
import { CommentService } from '../service/comment-service';

export class CommentController {
  notFound: Boom;
  router: express.Router;
  commentService: CommentService;
  validateComment: RequestHandler;
  validateCommentPUT: RequestHandler;
  validateParams: RequestHandler;

  constructor(options: Dependencies) {
    this.notFound = Boom.notFound("Comment doesn't exist");
    this.router = express.Router();
    this.commentService = options.commentService;
    this.validateComment = options.validateComment;
    this.validateCommentPUT = options.validateCommentPUT;
    this.validateParams = options.validateParams;
    this.initializeRoutes();
  }

  initializeRoutes() {
    this.router.get('/', this.readAll);
    this.router.get('/:id', this.validateParams, this.readOne);
    this.router.post('/', this.validateComment, this.create);
    this.router.delete('/:id', this.validateParams, this.delete);
    this.router.put('/:id', this.validateParams, this.validateCommentPUT, this.update);
  }

  readAll = async (req: Request, res: Response, next: NextFunction) => {
    try {
      const comments = await this.commentService.find();
      res.status(200).send(comments);
    } catch (error) {
      next(Boom.badImplementation());
    }
  };

  readOne = async (req: Request, res: Response, next: NextFunction) => {
    try {
      const comment = await this.commentService.findOne(req.params.id);
      if (comment) {
        res.status(200).send(comment);
      } else {
        next(this.notFound);
      }
    } catch (error) {
      // in case of an internal error
      next(Boom.badImplementation());
    }
  };

  create = async (req: Request, res: Response, next: NextFunction) => {
    try {
      const comment = await this.commentService.save(
        req.body.userId,
        req.body.postId,
        req.body.message,
        req.body.username
      );
      if (comment) {
        res.status(201).send(comment);
      } else {
        next(Boom.notFound());
      }
    } catch (error) {
      next(Boom.badImplementation());
    }
  };

  delete = async (req: Request, res: Response, next: NextFunction) => {
    try {
      const deleted = await this.commentService.delete(req.params.id);
      if (deleted.affected) {
        res.sendStatus(204);
      } else {
        next(this.notFound);
      }
    } catch (error) {
      next(Boom.badImplementation());
    }
  };

  update = async (req: Request, res: Response, next: NextFunction) => {
    try {
      const updated = await this.commentService.update(req.params.id, req.body);
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
