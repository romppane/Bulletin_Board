import { plainToClass } from 'class-transformer';
import { validate } from 'class-validator';
import { Request, Response, NextFunction } from 'express';
import { Post } from '../entities/post';

export const validatePost = (req : Request, res : Response, next: NextFunction)  => 
{
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