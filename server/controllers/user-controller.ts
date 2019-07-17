import express from 'express';
import Boom from '@hapi/boom';
import { Dependencies } from '../types';
import { Request, Response, NextFunction, RequestHandler } from 'express-serve-static-core';
import { UserService } from '../service/user-service';

export class UserController {
  notFound: Boom;
  router: express.Router;
  userService: UserService;
  validateParams: RequestHandler;
  constructor(options: Dependencies) {
    this.router = express.Router();
    this.notFound = Boom.notFound("User doesn't exist");
    this.userService = options.userService;
    this.validateParams = options.validateParams;
    this.initializeRoutes();
  }

  initializeRoutes() {
    this.router.get('/', this.getAll.bind(this));
    this.router.get('/:id', this.validateParams, this.getOne.bind(this));
    this.router.post('/', this.post.bind(this));
    this.router.delete('/:id', this.validateParams, this.delete.bind(this));
    this.router.put('/:id', this.validateParams, this.update.bind(this));
  }

  async getAll(req: Request, res: Response, next: NextFunction) {
    try {
      const users = await this.userService.find();
      res.status(200).send(users);
    } catch (error) {
      next(Boom.badImplementation());
    }
  }

  async getOne(req: Request, res: Response, next: NextFunction) {
    try {
      const responce = await this.userService.findOne(req.params.id);
      if (responce) {
        res.status(200).send(responce);
      } else {
        next(this.notFound);
      }
    } catch (error) {
      next(Boom.badImplementation());
    }
  }

  async post(req: Request, res: Response, next: NextFunction) {
    try {
      const user = await this.userService.save(req.body.avatar);
      res.status(201).send(user);
    } catch (error) {
      next(Boom.badImplementation());
    }
  }

  async delete(req: Request, res: Response, next: NextFunction) {
    try {
      const deleted = await this.userService.delete(req.params.id);
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
    // With the limited attributes given to user, only thing they're allowed to change is avatar picture
    // Have to explore how sending pictures in url parameters works, but I'm guessing this is a spot where
    // picture to base64 needs to be run?
    try {
      // Bootleg validator as user has only few fields now and avatar is the only one you can change.
      // When user gets more advaced create proper validation to it! Class-validator can check Base64 encoding for the avatar.
      req.body = { avatar: req.body.avatar };
      const updated = await this.userService.update(req.params.id, req.body);
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
