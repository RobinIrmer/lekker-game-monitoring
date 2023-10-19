import {NextFunction, Request, Response, Router} from 'express';
import {ValidationMiddleware} from '../../middleware/validation/validationMiddleware';
import {AuthenticationApiInterface} from '../../../package/openapi';

export class AuthenticationRouter {
    private router: Router;
    private authenticationService: AuthenticationApiInterface;
    private signinValidation: ValidationMiddleware;
    private signupValidation: ValidationMiddleware;

    constructor(authenticationService: AuthenticationApiInterface, signinValidation: ValidationMiddleware, signupValidation: ValidationMiddleware, router: Router) {
        this.authenticationService = authenticationService;
        this.signinValidation = signinValidation;
        this.signupValidation = signupValidation;
        this.router = router;
        this.initializeRoutes();
    }

    private initializeRoutes(): void {
        this.router.post('/signin', this.signinValidation.validate, this.signin);
        this.router.post('/signup', this.signupValidation.validate, this.signup);
    }

    private signin = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
        try {
            res.send(await this.authenticationService.signinPost(
                {signinRequest: req.body},
                {headers: req.headers as HeadersInit},
            ));
        } catch (err) {
            next(err);
        }
    };

    private signup = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
        try {
            await this.authenticationService.signupPost({signupRequest: req.body});
            res.status(200).send('Successful signup');
        } catch (err) {
            next(err);
        }
    };
}


