import {NextFunction, Request, Response, Router} from 'express';
import {AuthenticationMiddleware} from '../../middleware';
import {InvitationApiInterface} from '../../../package/openapi';
import {ValidationMiddleware} from '../../middleware/validation/validationMiddleware';

export class InvitationRouter {
    private router: Router;
    private authenticationMiddleware: AuthenticationMiddleware;
    private invitationService: InvitationApiInterface;
    private createInvitationValidation: ValidationMiddleware;
    private updateInvitationValidation: ValidationMiddleware;

    constructor(authenticationMiddleware: AuthenticationMiddleware, createInvitationValidation: ValidationMiddleware, updateInvitationValidation: ValidationMiddleware, invitationService: InvitationApiInterface, router: Router) {
        this.authenticationMiddleware = authenticationMiddleware;
        this.createInvitationValidation = createInvitationValidation;
        this.updateInvitationValidation = updateInvitationValidation;
        this.invitationService = invitationService;
        this.router = router;
        this.initializeRoutes();
    }

    private initializeRoutes(): void {
        const authMiddleware = (req: Request, res: Response, next: NextFunction) => {
            this.authenticationMiddleware.validateToken(req, res, next);
        };

        this.router.post('/teams/:teamId/invitations', authMiddleware, this.createInvitationValidation.validate, this.createInvitation);
        this.router.get('/teams/:teamId/invitations', authMiddleware, this.getInvitation);
        this.router.put('/teams/:teamId/invitations', authMiddleware, this.updateInvitationValidation.validate, this.updateInvitation);
    }

    private createInvitation = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
        try {
            res.send(await this.invitationService.teamsTeamIdInvitationsPost(
                {teamId: req.params.teamId},
                {headers: req.headers as HeadersInit}));
        } catch (err) {
            next(err);
        }

    };

    private getInvitation = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
        try {
            res.send(await this.invitationService.teamsTeamIdInvitationsGet(
                {teamId: req.params.teamId},
                {headers: req.headers as HeadersInit}));
        } catch (err) {
            next(err);
        }
    };

    private updateInvitation = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
        try {
            res.send(await this.invitationService.teamsTeamIdInvitationsPut(
                {
                    teamId: req.params.teamId,
                    putInvitationRequest: {userId: req.body.userId, membership: req.body.membership},
                },
                {headers: req.headers as HeadersInit}));
        } catch (err) {
            next(err);
        }
    };
}

