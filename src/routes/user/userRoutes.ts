import {NextFunction, Request, Response, Router} from 'express';
import {AuthenticationMiddleware} from '../../middleware';
import {UserManagementApiInterface} from '../../../package/openapi';

export class UserRouter {
    private router: Router;
    private authenticationMiddleware: AuthenticationMiddleware;
    private userService: UserManagementApiInterface;

    constructor(authenticationMiddleware: AuthenticationMiddleware, userService: UserManagementApiInterface, router: Router) {
        this.authenticationMiddleware = authenticationMiddleware;
        this.userService = userService;
        this.router = router;
        this.initializeRoutes();
    }

    private initializeRoutes(): void {
        const authMiddleware = (req: Request, res: Response, next: NextFunction) => {
            this.authenticationMiddleware.validateToken(req, res, next);
        };

        this.router.get('/users', authMiddleware, this.getInvitation);
    }

    private getInvitation = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
        try {
            res.send(await this.userService.usersGet());
        } catch (err) {
            next(err);
        }
    };
}


