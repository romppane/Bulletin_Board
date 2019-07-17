import express from 'express';
import Boom from '@hapi/boom';
import { validateReply, validateReplyPUT, validateParams } from '../middleware/validation';
import { Dependencies } from '../types';
import { Request, Response, NextFunction } from 'express-serve-static-core';
import { ReplyService } from '../service/reply-service';

export class ReplyController {
  notFound: Boom;
  router: express.Router;
  // How do I make array of Repositories? : Repository<Entity> is not allowed :D
  replyService: ReplyService;

  constructor(options: Dependencies) {
    this.notFound = Boom.notFound("Comment doesn't exist");
    this.router = express.Router();
    this.replyService = options.replyService;
    this.initializeRoutes();
  }

  initializeRoutes() {
    this.router.get('/', this.getAll);
    this.router.get('/:id', validateParams, this.getOne);
    this.router.post('/', validateReply, this.post);
    this.router.delete('/:id', validateParams, this.delete);
    this.router.put('/:id', validateParams, validateReplyPUT, this.update);
  }
  getAll = async (req: Request, res: Response, next: NextFunction) => {
    try {
      const replies = await this.replyService.find();
      res.status(200).send(replies);
    } catch (error) {
      next(Boom.badImplementation());
    }
  };

  getOne = async (req: Request, res: Response, next: NextFunction) => {
    try {
      const reply = await this.replyService.findOne(req.params.id);
      if (reply) {
        res.status(200).send(reply);
      } else {
        next(this.notFound);
      }
    } catch (error) {
      // in case of an internal error
      next(Boom.badImplementation());
    }
  };

  post = async (req: Request, res: Response, next: NextFunction) => {
    try {
      const reply = await this.replyService.save(
        req.body.userId,
        req.body.postId,
        req.body.message
      );
      if (reply) {
        res.status(201).send(reply);
      } else {
        next(Boom.notFound());
      }
    } catch (error) {
      next(Boom.badImplementation());
    }
  };

  delete = async (req: Request, res: Response, next: NextFunction) => {
    try {
      const deleted = await this.replyService.delete(req.params.id);
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
      // Validate out any unnecessary fields
      const updated = await this.replyService.update(req.params.id, req.body);
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
