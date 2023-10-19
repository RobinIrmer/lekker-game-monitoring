import {Team, TeamMember, User} from '@prisma/client';

export type CreateTeamArgs = {
    name: string;
    totalScore: number;
    maxMemberNumber: number;
    ownerId: string;
}

export type UpdateTeamArgs = {
    id: string;
    name?: string;
    totalScore?: number;
    maxMemberNumber?: number;
}

export type GetTeamMember = Team & { members: (TeamMember & { user: User })[] }

export interface TeamRepositoryInterface {
    listTeams(): Promise<Array<Team>>;

    getTeam(teamId: string): Promise<Team | null>;

    createTeam(team: CreateTeamArgs): Promise<Team>;

    deleteTeam(teamId: string): Promise<Team>;

    getTeamMember(teamId: string): Promise<GetTeamMember | null>;

    updateTeam(team: UpdateTeamArgs): Promise<Team>;
}