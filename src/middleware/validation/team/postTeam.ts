import {NextFunction, Request, Response} from 'express';
import {ValidationMiddleware} from '../validationMiddleware';
import {HttpError} from '../../../internal';

export class PostTeamValidation implements ValidationMiddleware {
    validate(req: Request, res: Response, next: NextFunction): void {
        const {teamName, maxMemberNumber} = req.body;

        if (!teamName || typeof teamName !== 'string') {
            throw new HttpError('team name is required and must be a string.', 400);
        }

        if (
            !maxMemberNumber ||
            typeof maxMemberNumber !== 'number' ||
            maxMemberNumber <= 10
        ) {
            throw new HttpError('maximum number of team members is required and must be a number greater than 10.', 400);
        }

        next();
    }
}