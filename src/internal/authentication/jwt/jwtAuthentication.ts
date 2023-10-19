import {Authentication} from '../authentication';
import jwt from 'jsonwebtoken';
import {HttpError} from '../../index';

export class JwtAuthentication implements Authentication {
    private readonly secret: string;

    constructor(secret: string) {
        this.secret = secret;
    }

    sign(userId: string): string {
        return jwt.sign({userId}, this.secret, {
            expiresIn: '1h',
        });
    }

    validate(token: string): string {
        const tokenWithoutBearer: string = token.replace('Bearer ', '');

        try {
            const decodedToken = jwt.verify(tokenWithoutBearer, this.secret);

            if (typeof decodedToken !== 'object' || !decodedToken.userId) {
                throw new Error();
            }

            return decodedToken.userId;
        } catch (err) {
            throw new HttpError('authentication failed: invalid token', 401);
        }
    }
}