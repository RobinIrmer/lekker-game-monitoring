import {
    InitOverrideFunction,
    InvitationApiInterface,
    InvitationResponse,
    InvitationResponseFromJSON,
    TeamsTeamIdInvitationsGetRequest,
    TeamsTeamIdInvitationsPostRequest,
    TeamsTeamIdInvitationsPutRequest
} from '../../../package/openapi';
import {InvitationRepositoryInterface, TeamRepositoryInterface, UserRepositoryInterface} from '../../repositories';
import {Authentication, HttpError} from '../../internal';
import {Invitation} from '../../repositories/invitation/invitationsRepositoryInterface';

export class InvitationService implements InvitationApiInterface {
    private invitationRepository: InvitationRepositoryInterface;
    private authentication: Authentication;
    private teamRepository: TeamRepositoryInterface;
    private userRepository: UserRepositoryInterface;

    constructor(invitationRepository: InvitationRepositoryInterface, authentication: Authentication, teamRepository: TeamRepositoryInterface, userRepository: UserRepositoryInterface) {
        this.invitationRepository = invitationRepository;
        this.authentication = authentication;
        this.teamRepository = teamRepository;
        this.userRepository = userRepository;
    }

    async teamsTeamIdInvitationsGet(requestParameters: TeamsTeamIdInvitationsGetRequest, initOverrides?: RequestInit | InitOverrideFunction): Promise<Array<InvitationResponse>> {
        const invitations: Invitation[] = await this.invitationRepository.listInvitations(requestParameters.teamId);

        return invitations.map((invitation: Invitation) => InvitationResponseFromJSON(invitation));
    }

    async teamsTeamIdInvitationsPost(requestParameters: TeamsTeamIdInvitationsPostRequest, initOverrides?: RequestInit | InitOverrideFunction): Promise<InvitationResponse> {
        const headers: HeadersInit = (initOverrides as RequestInit).headers!;
        const userId: string = this.authentication.validate((headers as Record<string, string>)['authorization']);

        const invitation: Invitation = await this.invitationRepository.createInvitation(userId, requestParameters.teamId);

        return InvitationResponseFromJSON(invitation);
    }

    async teamsTeamIdInvitationsPut(requestParameters: TeamsTeamIdInvitationsPutRequest, initOverrides?: RequestInit | InitOverrideFunction): Promise<InvitationResponse> {
        const {userId, membership} = requestParameters.putInvitationRequest;

        const team = await this.teamRepository.getTeam(requestParameters.teamId);

        if (!team) {
            throw new HttpError('team not found!', 400);
        }

        const user = await this.userRepository.getUser(userId);

        await this.teamRepository.updateTeam({
            id: requestParameters.teamId,
            totalScore: (team!.totalScore + user!.score),
        });

        const invitation: Invitation = await this.invitationRepository.updateMembership(userId, requestParameters.teamId, membership);

        return InvitationResponseFromJSON(invitation);
    }
}
