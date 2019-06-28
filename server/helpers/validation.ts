import { plainToClass } from 'class-transformer';
import { validate } from 'class-validator';
import { Request, Response, NextFunction } from 'express';
import { Post } from '../entities/post';

export const validatePost = (req : Request, res : Response, next: NextFunction)  => 
{
    req.body = plainToClass(Post, req.body, { excludeExtraneousValues: true })
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