import {NextFunction, Request, Response, Router} from 'express';
import {TeamManagementApiInterface} from '../../../package/openapi';
import {AuthenticationMiddleware} from '../../middleware';
import {ValidationMiddleware} from '../../middleware/validation/validationMiddleware';

export class TeamRouter {
    private router: Router;
    private authenticationMiddleware: AuthenticationMiddleware;
    private teamService: TeamManagementApiInterface;
    private createTeamValidation: ValidationMiddleware;
    private updateTeamValidation: ValidationMiddleware;

    constructor(authenticationMiddleware: AuthenticationMiddleware, createTeamValidation: ValidationMiddleware, updateTeamValidation: ValidationMiddleware, teamService: TeamManagementApiInterface, router: Router) {
        this.authenticationMiddleware = authenticationMiddleware;
        this.teamService = teamService;
        this.updateTeamValidation = updateTeamValidation;
        this.createTeamValidation = createTeamValidation;
        this.router = router;
        this.initializeRoutes();
    }

    private initializeRoutes(): void {
        const authMiddleware = (req: Request, res: Response, next: NextFunction) => {
            this.authenticationMiddleware.validateToken(req, res, next);
        };

        this.router.post('/teams', authMiddleware, this.createTeamValidation.validate, this.createTeam);
        this.router.get('/teams', authMiddleware, this.getTeams);
        this.router.delete('/teams/:teamId', authMiddleware, this.updateTeamValidation.validate, this.deleteTeam);
        this.router.put('/teams/:teamId', authMiddleware, this.updateTeam);
        this.router.get('/teams/:teamId/members', authMiddleware, this.getTeamMembers);
    }

    private createTeam = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
        try {
            res.send(await this.teamService.teamsPost(
                {postTeamRequest: {teamName: req.body.teamName, maxMemberNumber: req.body.maxMemberNumber}},
                {headers: req.headers as HeadersInit},
            ));
        } catch (err) {
            next(err);
        }
    };

    private getTeams = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
        try {
            res.send(await this.teamService.teamsGet({headers: req.headers as HeadersInit}));
        } catch (err) {
            next(err);
        }
    };

    private deleteTeam = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
        try {
            res.send(await this.teamService.teamsTeamIdDelete(
                {teamId: req.params.teamId},
                {headers: req.headers as HeadersInit},
            ));
        } catch (err) {
            next(err);
        }
    };

    private updateTeam = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
        try {
            const {teamName, maxMemberNumber} = req.body;
            const team = await this.teamService.teamsTeamIdPut(
                {teamId: req.params.teamId, teamsTeamIdPutRequest: {teamName, maxMemberNumber}},
                {headers: req.headers as HeadersInit},
            );

            res.send(team);
        } catch (err) {
            next(err);
        }
    };

    private getTeamMembers = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
        try {
            res.send(await this.teamService.teamsTeamIdMembersGet(
                {teamId: req.params.teamId},
                {headers: req.headers as HeadersInit},
            ));
        } catch (err) {
            next(err);
        }
    };
}
