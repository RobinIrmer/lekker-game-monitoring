import {AuthenticationMiddleware} from '../authenticationMiddleware';
import {NextFunction, Request, Response} from 'express';
import {Authentication, HttpError} from '../../../internal';

export class JwtAuthenticationMiddleware implements AuthenticationMiddleware {
    public readonly authentication: Authentication;

    constructor(authentication: Authentication) {
        this.authentication = authentication;
    }

    public validateToken(req: Request, res: Response, next: NextFunction): void {
        const token: string | undefined = req.header('authorization');

        if (!token) {
            throw new HttpError('authentication failed: no token provided', 401);
        }

        this.authentication.validate(token);

        next();
    }
}