import { Request, Response, NextFunction } from 'express';
import Boom = require('@hapi/boom');

// Collective error handler which actions depend on the statuscodes it gets
export function handleErrors(err: Boom, req: Request, res: Response, next: NextFunction) {
  switch (err.output.statusCode) {
    case 500: {
      // Internal errors
      res.status(err.output.statusCode).send({
        Error: 'Something unexpected happened during the request.'
      });
      break;
    }
    case 404: {
      res.status(err.output.statusCode).send({
        Error: err.message
      });
      break;
    }
    case 400: {
      res.status(err.output.statusCode).send({
        Error: err.message
      });
      // Validation error, bad syntax
      break;
    }
    default: {
      res.status(err.output.statusCode).send('Something terrible has happened');
      // Something very unexpected, handle as 500
      break;
    }
  }
}
