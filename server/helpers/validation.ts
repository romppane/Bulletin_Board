import { plainToClass } from 'class-transformer';
import { validate, ValidationSchema } from 'class-validator';
import { Request, Response, NextFunction } from 'express';
import { Post } from '../entities/post';


// conditionalValidation = isOptional -> https://github.com/typestack/class-validator/issues/147
// The validation still doesn't check what the user inputs very well.
export const postPUTSchema: ValidationSchema = {
    name: "postPUTSchema",
    properties: {
        category: [{
            type: 'conditionalValidation', constraints: [(object: any, value: any) => {
                return object['message'] !== null && object['message'] !== undefined;
            }]
        },  {
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

export const validatePost = (req: Request, res: Response, next: NextFunction) => {
    // Remove any extra fields and turn the plain object in to instance of a Post
    req.body = plainToClass(Post, req.body, { excludeExtraneousValues: true })
    // See if the newly made Post is valid
    validate(req.body).then(errors => { // errors is an array of validation errors
        if (errors.length > 0) {
            console.log("validation failed. errors: ", errors);
            res.send(errors);
        } else {
            console.log("validation succeed");
            next();
        }
    });
}

// Validating a PUT request can not be done the same way as Post as PUT requires only half the data
// and even that data can be optional. Thats why the validation in this case is done with a schema
export const validatePostPUT = (req: Request, res: Response, next: NextFunction) => {
    validate("postPUTSchema", req.body).then(errors => {
        if (errors.length > 0) {
            console.log("validation failed. errors: ", errors);
            res.send(errors);
        } else {
            console.log("validation succeed");
            next();
        }

    });
}