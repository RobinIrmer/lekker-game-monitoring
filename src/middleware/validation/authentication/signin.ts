import {NextFunction, Request, Response} from 'express';
import {ValidationMiddleware} from '../validationMiddleware';
import {HttpError} from '../../../internal';

export class SigninValidation implements ValidationMiddleware {
    validate(req: Request, res: Response, next: NextFunction): void {
        const {email, password} = req.body;

        if (!email || typeof email !== 'string') {
            throw new HttpError('email is required and must be a string.', 400);
        }

        if (!password || typeof password !== 'string') {
            throw new HttpError('password is required and must be a string.', 400);
        }

        next();
    }
}