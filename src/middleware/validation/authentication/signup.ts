import {NextFunction, Request, Response} from 'express';
import {ValidationMiddleware} from '../validationMiddleware';
import {HttpError} from '../../../internal';

export class SignupValidation implements ValidationMiddleware {
    validate(req: Request, res: Response, next: NextFunction): void {
        const {email, password, name} = req.body;

        if (!email || typeof email !== 'string') {
            throw new HttpError('email is required and must be a string.', 400);
        }

        if (!password || typeof password !== 'string') {
            throw new HttpError('password is required and must be a string.', 400);
        }

        if (!name || typeof name !== 'string') {
            throw new HttpError('name is required and must be a string.', 400);
        }

        next();
    }
}