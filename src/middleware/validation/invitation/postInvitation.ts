import {NextFunction, Request, Response} from 'express';
import {ValidationMiddleware} from '../validationMiddleware';
import {HttpError} from '../../../internal';
import {PutInvitationRequestMembershipEnum} from '../../../../package/openapi';

export class PostInvitationValidaiton implements ValidationMiddleware {
    validate(req: Request, res: Response, next: NextFunction): void {
        const {membership, userId} = req.body;

        if (!membership || typeof membership !== 'string' || !Object.values(PutInvitationRequestMembershipEnum).includes(membership as PutInvitationRequestMembershipEnum)) {
            throw new HttpError('membership is required and must be a value of enum', 400);
        }

        if (!userId || typeof userId !== 'string') {
            throw new HttpError('userId is required and must be a string.', 400);
        }

        next();
    }
}