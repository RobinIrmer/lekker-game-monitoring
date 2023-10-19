import express, {Express, NextFunction, Request, Response} from 'express';
import {PrismaClient} from '@prisma/client';
import {Authentication, BcryptPasswordSecurity, HttpError, JwtAuthentication, PasswordSecurity} from './internal';
import {AuthenticationMiddleware, JwtAuthenticationMiddleware} from './middleware';
import {ValidationMiddleware} from './middleware/validation/validationMiddleware';
import {SigninValidation} from './middleware/validation/authentication/signin';
import {SignupValidation} from './middleware/validation/authentication/signup';
import {
    InvitationRepository,
    InvitationRepositoryInterface,
    TeamRepository,
    TeamRepositoryInterface,
    UserRepository,
    UserRepositoryInterface
} from './repositories';
import {
    AuthenticationApiInterface,
    InvitationApiInterface,
    TeamManagementApiInterface,
    UserManagementApiInterface
} from '../package/openapi';
import {AuthService, InvitationService, TeamService, UserService} from './service';
import {AuthenticationRouter, InvitationRouter, TeamRouter, UserRouter} from './routes';
import {PostTeamValidation} from './middleware/validation/team/postTeam';
import {PutTeamValidation} from './middleware/validation/team/putTeam';
import {PostInvitationValidaiton} from './middleware/validation/invitation/postInvitation';
import {PutInvitationValidaiton} from './middleware/validation/invitation/putInvitation';
import swaggerJSDoc from 'swagger-jsdoc';
import swaggerUI from 'swagger-ui-express';
import path from 'path';

export class MyApp {
    public readonly app: Express = express();

    constructor(jwtSecret: string) {
        const authentication: Authentication = new JwtAuthentication(jwtSecret);
        const passwordSecurity: PasswordSecurity = new BcryptPasswordSecurity();
        const authenticationMiddleware: AuthenticationMiddleware = new JwtAuthenticationMiddleware(authentication);
        const signinValidation: ValidationMiddleware = new SigninValidation();
        const signupValidation: ValidationMiddleware = new SignupValidation();
        const createTeamValidation: ValidationMiddleware = new PostTeamValidation();
        const updateTeamValidation: ValidationMiddleware = new PutTeamValidation();
        const createInvitationValidation: ValidationMiddleware = new PostInvitationValidaiton();
        const updateInvitationValidation: ValidationMiddleware = new PutInvitationValidaiton();

        const prisma: PrismaClient = new PrismaClient();
        const userRepository: UserRepositoryInterface = new UserRepository(prisma);
        const teamRepository: TeamRepositoryInterface = new TeamRepository(prisma);
        const invitationRepository: InvitationRepositoryInterface = new InvitationRepository(prisma);

        const authenticationService: AuthenticationApiInterface = new AuthService(userRepository, authentication, passwordSecurity);
        const teamService: TeamManagementApiInterface = new TeamService(teamRepository, authentication, userRepository);
        const userService: UserManagementApiInterface = new UserService(userRepository);
        const invitationService: InvitationApiInterface = new InvitationService(invitationRepository, authentication, teamRepository, userRepository);

        const router: express.Router = express.Router();
        new TeamRouter(authenticationMiddleware, createTeamValidation, updateTeamValidation, teamService, router);
        new UserRouter(authenticationMiddleware, userService, router);
        new InvitationRouter(authenticationMiddleware, createInvitationValidation, updateInvitationValidation, invitationService, router);
        new AuthenticationRouter(authenticationService, signinValidation, signupValidation, router);

        this.app.use(express.json());
        this.app.use(router);

        this.app.get('/health', (req: Request, res: Response) => {
            res.status(200).json({status: 'healthy'});
        });

        this.app.use((error: Error, req: Request, res: Response, next: NextFunction) => {
            let statusCode: number = 500;

            if (error instanceof HttpError) {
                statusCode = error.statusCode;
            }

            res.status(statusCode).json({error: error.message || 'Internal Server Error'});
        });

        const openApiYamlPath: string = path.join(__dirname, 'openapi.yaml');

        const options = {
            swaggerDefinition: {
                openapi: '3.0.0',
                info: {
                    title: 'User and Team Management API',
                    version: '1.0.0',
                    description: 'API for user and team management with JWT internal',
                },
            },
            apis: [openApiYamlPath],
        };

        const swaggerSpec = swaggerJSDoc(options);

        this.app.use('/api-docs', swaggerUI.serve, swaggerUI.setup(swaggerSpec));

        this.app.use((request: Request, response: Response, next: NextFunction) => {
            response.status(404).send({message: 'no route found'});
        });

        this.app.use(((err: Error, request: Request, response: Response, next: NextFunction) => {
            console.log(err);
        }));
    }
}
