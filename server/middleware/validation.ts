import { plainToClass } from 'class-transformer';
import { validate, ValidationSchema } from 'class-validator';
import { Request, Response, NextFunction } from 'express';
import { Post } from '../entities/post';
import Boom from '@hapi/boom';
import { Comment } from '../entities/comment';
// As the validation will be put to use on all the classes the structure of this file will need some refactoring.

const validationError = Boom.badRequest('Validation error');

// conditionalValidation = isOptional -> https://github.com/typestack/class-validator/issues/147
// The validation still doesn't check what the user inputs very well.
export const postPUTSchema: ValidationSchema = {
  name: 'postPUTSchema',
  properties: {
    tittle: [
      {
        type: 'conditionalValidation',
        constraints: [
          (object: any, value: any) => {
            return object['tittle'] !== null && object['tittle'] !== undefined;
          }
        ]
      },
      {
        type: 'minLength',
        constraints: [1]
      },
      {
        type: 'maxLength',
        constraints: [50]
      },
      {
        type: 'isString'
      }
    ],
    message: [
      {
        type: 'conditionalValidation',
        constraints: [
          (object: any, value: any) => {
            return object['message'] !== null && object['message'] !== undefined;
          }
        ]
      },
      {
        type: 'minLength',
        constraints: [1]
      },
      {
        type: 'maxLength',
        constraints: [1000]
      },
      {
        type: 'isString'
      }
    ]
  }
};

export const commentPUTSchema: ValidationSchema = {
  name: 'commentPUTSchema',
  properties: {
    message: [
      {
        type: 'maxLength',
        constraints: [500]
      },
      {
        type: 'isString'
      }
    ]
  }
};

// Optional parameters are not good approach as they just result in internal error and not validation error.
// Have to play around with class-validation to see how foreign keys could be validated from the body.
export const requestParamSchema: ValidationSchema = {
  name: 'requestParamSchema',
  properties: {
    id: [
      {
        type: 'isInt'
      },
      {
        type: 'min',
        constraints: [1]
      }
    ]
  }
};

export const validatePost = (req: Request, res: Response, next: NextFunction) => {
  // Remove any extra fields and turn the plain object in to instance of a Post
  const newpost = plainToClass(Post, req.body, { excludeExtraneousValues: true });
  // See if the newly made Post is valid
  validate(newpost).then(errors => {
    console.log(errors);
    // errors is an array of validation errors
    if (errors.length > 0) {
      next(validationError);
    } else {
      req.body = newpost;
      next();
    }
  });
};

export const validateComment = (req: Request, res: Response, next: NextFunction) => {
  // Remove any extra fields and turn the plain object in to instance of a Post
  const comment = plainToClass(Comment, req.body, { excludeExtraneousValues: true });
  // See if the newly made Post is valid
  validate(comment).then(errors => {
    // errors is an array of validation errors
    if (errors.length > 0) {
      next(validationError);
    } else {
      req.body = comment;
      next();
    }
  });
};

interface ValidPostBody {
  message?: string;
  tittle?: string;
}

// Validating a PUT request can not be done the same way as Post as PUT requires only half the data
// and even that data can be optional. Thats why the validation in this case is done with a schema
export const validatePostPUT = (req: Request, res: Response, next: NextFunction) => {
  validate('postPUTSchema', req.body).then(errors => {
    if (errors.length > 0) {
      next(validationError);
    } else {
      // Strip unwanted fields.
      let fields: ValidPostBody = {};
      if (req.body.message) {
        fields.message = req.body.message;
      }
      if (req.body.tittle) {
        fields.tittle = req.body.tittle;
      }
      req.body = fields;
      next();
    }
  });
};

interface ValidCommentBody {
  message: string;
}

export const validateCommentPUT = (req: Request, res: Response, next: NextFunction) => {
  validate('commentPUTSchema', req.body).then(errors => {
    if (errors.length > 0) {
      next(validationError);
    } else {
      const valid: ValidCommentBody = {
        message: req.body.message
      };
      req.body = valid;
      next();
    }
  });
};

interface ValidParams {
  id: number;
}

// ID VALUES ARE STRING... Figure out how to convert, then test
export const validateParams = (req: Request, res: Response, next: NextFunction) => {
  const valid: ValidParams = { id: parseInt(req.params.id) };
  validate('requestParamSchema', valid).then(errors => {
    if (errors.length > 0) {
      next(validationError);
    } else {
      req.params = valid;
      next();
    }
  });
};
