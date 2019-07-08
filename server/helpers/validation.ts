import { plainToClass } from 'class-transformer';
import { validate, ValidationSchema } from 'class-validator';
import { Request, Response, NextFunction } from 'express';
import { Post } from '../entities/post';
import Boom from '@hapi/boom';
import { Reply } from '../entities/reply';
// As the validation will be put to use on all the classes the structure of this file will need some refactoring.

const validationError : Boom = Boom.badRequest("Validation error");

// conditionalValidation = isOptional -> https://github.com/typestack/class-validator/issues/147
// The validation still doesn't check what the user inputs very well.
export const postPUTSchema: ValidationSchema = {
    name: "postPUTSchema",
    properties: {
        category: [{
            type: 'conditionalValidation', constraints: [(object: any, value: any) => {
                return object['category'] !== null && object['category'] !== undefined;
            }]
        }, {
            type: "minLength",
            constraints: [1]
        }, {
            type: "maxLength",
            constraints: [50]
        }, {
            type: "isString"
        }],
        message: [{
            type: 'conditionalValidation', constraints: [(object: any, value: any) => {
                return object['message'] !== null && object['message'] !== undefined;
            }]
        }, {
            type: "minLength",
            constraints: [1]
        }, {
            type: "maxLength",
            constraints: [1000]
        }, {
            type: "isString"
        }]
    }
}

export const replyPUTSchema: ValidationSchema = {
    name: "replyPUTSchema",
    properties: {
        message: [{
            type : "maxLength",
            constraints: [500]
        }, {
            type: "isString"
        }]
    }
}

// Once routing starts using more than params.id add the values here as optional
export const requestParamSchema : ValidationSchema = {
    name: "requestParamSchema",
    properties: {
        id: [{
            type: "isInt"
        }, {
            type: "min",
            constraints: [0]
        }]
    }
}

export const validatePost = (req: Request, res: Response, next: NextFunction) => {
    // Remove any extra fields and turn the plain object in to instance of a Post
    const newpost = plainToClass(Post, req.body, { excludeExtraneousValues: true })
    // See if the newly made Post is valid
    validate(newpost).then(errors => { // errors is an array of validation errors
        if (errors.length > 0) {
            next(validationError);
        } else {
            req.body = newpost;
            next();
        }
    });
}

export const validateReply = (req: Request, res: Response, next: NextFunction) => {
    // Remove any extra fields and turn the plain object in to instance of a Post
    const reply = plainToClass(Reply, req.body, { excludeExtraneousValues: true })
    // See if the newly made Post is valid
    validate(reply).then(errors => { // errors is an array of validation errors
        if (errors.length > 0) {
            next(validationError);
        } else {
            req.body = reply;
            next();
        }
    });
}


interface validPostBody {
    message?: string,
    category?: string
}

// Validating a PUT request can not be done the same way as Post as PUT requires only half the data
// and even that data can be optional. Thats why the validation in this case is done with a schema
export const validatePostPUT = (req: Request, res: Response, next: NextFunction) => {
    validate("postPUTSchema", req.body).then(errors => {
        if (errors.length > 0) {
            next(validationError);
        } else {
            // Strip unwanted fields.
            let fields : validPostBody = {};
            if(req.body.message) {
                fields.message = req.body.message;
            }
            if(req.body.category) {
                fields.category = req.body.category;
            }
            req.body = fields;
            next();
        }

    });
}

interface validReplyBody {
    message : string
}

export const validateReplyPUT = (req: Request, res: Response, next: NextFunction) => {
    validate("replyPUTSchema", req.body).then(errors => {
        if(errors.length > 0) {
            next(validationError);
        } else {
            const valid : validReplyBody = {
                message: req.body.message
            }
            req.body = valid;
            next();
        }

    });
}

interface validParams {
    id: number,
    user: number
}

// ID VALUES ARE STRING... Figure out how to convert, then test
export const validateParams = (req: Request, res: Response, next: NextFunction) => {
    const valid : validParams = {id : parseInt(req.params.id), user: req.params.user};
    validate("requestParamSchema", valid).then(errors => {
        if(errors.length > 0) {
            next(Boom.badRequest("Invalid parameters"))
        } else {
            req.params = valid;
            next();
        }
    });
}