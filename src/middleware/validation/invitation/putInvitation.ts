import {NextFunction, Request, Response} from 'express';
import {ValidationMiddleware} from '../validationMiddleware';
import {HttpError} from '../../../internal';

export class PutInvitationValidaiton implements ValidationMiddleware {
  validate(req: Request, res: Response, next: NextFunction): void {
    const {userId} = req.body;

    if (!userId || typeof userId !== 'string') {
      throw new HttpError('userId is required and must be a string.', 400);
    }

    next();
  }
}