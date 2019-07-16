import express from 'express';
import { Reply } from '../entities/reply';
import { getRepository } from 'typeorm';
import Boom from '@hapi/boom';
import { validateReply, validateReplyPUT, validateParams } from '../middleware/validation';
import { Dependencies } from '../types';
import { Request, Response, NextFunction } from 'express-serve-static-core';

export class ReplyRouter {
  notFound: Boom;
  router: express.Router;
  // How do I make array of Repositories? : Repository<Entity> is not allowed :D
  repositories: any;

  constructor(options: Dependencies) {
    this.notFound = Boom.notFound("Comment doesn't exist");
    this.router = express.Router();
    this.repositories = {
      reply: options.replyRepository,
      post: options.postRepository,
      user: options.userRepository
    };
    this.initializeRoutes();
  }

  initializeRoutes() {
    this.router.get('/', this.getAll.bind(this));
    this.router.get('/:id', validateParams, this.getOne.bind(this));
    this.router.post('/', validateReply, this.post.bind(this));
    this.router.delete('/:id', validateParams, this.delete.bind(this));
    this.router.put('/:id', validateParams, validateReplyPUT, this.update.bind(this));
  }
  async getAll(req: Request, res: Response, next: NextFunction) {
    try {
      const replies = await this.repositories.reply.find();
      res.status(200).send(replies);
    } catch (error) {
      next(Boom.badImplementation());
    }
  }

  async getOne(req: Request, res: Response, next: NextFunction) {
    try {
      const reply = await this.repositories.reply.findOne(req.params.id);
      if (reply) {
        res.status(200).send(reply);
      } else {
        next(this.notFound);
      }
    } catch (error) {
      // in case of an internal error
      next(Boom.badImplementation());
    }
  }

  post(req: Request, res: Response, next: NextFunction) {
    Promise.all([
      this.repositories.user.findOne(req.body.userId),
      this.repositories.post.findOne(req.body.postId)
    ])
      .then(([user, post]) => {
        if (user && post) {
          const reply: Reply = new Reply(user, post, req.body.message);
          getRepository(Reply).save(reply);
          res.status(201).send(reply);
        } else {
          next(Boom.notFound());
        }
      })
      .catch(error => next(Boom.badImplementation()));
  }

  async delete(req: Request, res: Response, next: NextFunction) {
    try {
      const deleted = await this.repositories.reply.delete(req.params.id);
      if (deleted.affected) {
        res.sendStatus(204);
      } else {
        next(this.notFound);
      }
    } catch (error) {
      next(Boom.badImplementation());
    }
  }

  async update(req: Request, res: Response, next: NextFunction) {
    try {
      // Validate out any unnecessary fields
      await getRepository(Reply).update(req.params.id, req.body);
      const updated = await this.repositories.reply.findOne(req.params.id);
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
