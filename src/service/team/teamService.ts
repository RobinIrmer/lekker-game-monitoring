import {
    GetTeamMembersResponse,
    GetTeamMembersResponseFromJSON,
    InitOverrideFunction,
    Team,
    TeamFromJSON,
    TeamManagementApiInterface,
    TeamsPostRequest,
    TeamsTeamIdDeleteRequest,
    TeamsTeamIdMembersGetRequest,
    TeamsTeamIdPutOperationRequest
} from '../../../package/openapi';

import {TeamRepositoryInterface, UserRepositoryInterface} from '../../repositories';
import {Authentication, HttpError} from '../../internal';
import {GetTeamMember} from '../../repositories/team/teamRepositoryInterface';
import jwt from "jsonwebtoken";

export class TeamService implements TeamManagementApiInterface {
    private teamRepository: TeamRepositoryInterface;
    private authentication: Authentication;
    private userRepository: UserRepositoryInterface;

    constructor(teamRepository: TeamRepositoryInterface, authentication: Authentication, userRepository: UserRepositoryInterface) {
        this.teamRepository = teamRepository;
        this.authentication = authentication;
        this.userRepository = userRepository;
    }

    teamsGet(initOverrides?: RequestInit | InitOverrideFunction): Promise<Array<Team>> {
        return this.teamRepository.listTeams();
    }

    async teamsPost(requestParameters: TeamsPostRequest, initOverrides?: RequestInit | InitOverrideFunction): Promise<Team> {
        const headers: HeadersInit = (initOverrides as RequestInit).headers!;
        const userId: string = this.authentication.validate((headers as Record<string, string>)['authorization']);
        const {teamName, maxMemberNumber} = requestParameters.postTeamRequest;

        if (maxMemberNumber < 10) {
            throw new HttpError('Number is to low', 400);
        }

        if (!teamName) {
            throw new HttpError('TeamName is not provided', 400);
        }

        const user = await this.userRepository.getUser(userId);

        if (!user) {
            throw new HttpError('User not found', 400);
        }

        const team = await this.teamRepository.createTeam({
            name: teamName,
            totalScore: user.score,
            maxMemberNumber,
            ownerId: userId,
        });

        return TeamFromJSON(team);
    }

    async teamsTeamIdDelete(requestParameters: TeamsTeamIdDeleteRequest, initOverrides?: RequestInit | InitOverrideFunction): Promise<Team> {
        const headers: HeadersInit = (initOverrides as RequestInit).headers!;
        const userId: jwt.JwtPayload | string = this.authentication.validate((headers as Record<string, string>)['authorization']);

        const team = await this.teamRepository.getTeam(requestParameters.teamId);

        if (!team || userId !== team.ownerId) {
            throw new HttpError('not team owner', 403);
        }

        await this.teamRepository.deleteTeam(requestParameters.teamId);
        return TeamFromJSON(team);
    }

    async teamsTeamIdMembersGet(requestParameters: TeamsTeamIdMembersGetRequest, initOverrides?: RequestInit | InitOverrideFunction): Promise<GetTeamMembersResponse> {
        const teamMember: GetTeamMember | null = await this.teamRepository.getTeamMember(requestParameters.teamId);

        if (!teamMember) {
            throw new HttpError('team not found!', 400);
        }

        return GetTeamMembersResponseFromJSON({
            id: teamMember.id,
            name: teamMember.name,
            totalScore: teamMember.totalScore,
            member: teamMember.members.length,
            availableMember: teamMember.maxMemberNumber - teamMember.members.length,
            members: teamMember.members.map((teamMember) => teamMember.user),
        });
    }

    async teamsTeamIdPut(requestParameters: TeamsTeamIdPutOperationRequest, initOverrides?: RequestInit | InitOverrideFunction): Promise<Team> {
        const headers: HeadersInit = (initOverrides as RequestInit).headers!;
        const userId: string = this.authentication.validate((headers as Record<string, string>)['authorization']);
        const {teamName, maxMemberNumber} = requestParameters.teamsTeamIdPutRequest;

        const team = await this.teamRepository.getTeam(requestParameters.teamId);

        if (!team || userId !== team.ownerId) {
            throw new HttpError('not team owner', 403);
        }

        const updatedTeam = await this.teamRepository.updateTeam({
            name: teamName,
            id: requestParameters.teamId,
            maxMemberNumber,
        });

        return TeamFromJSON(updatedTeam);
    }

}
