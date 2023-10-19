import {CreateTeamArgs, GetTeamMember, TeamRepositoryInterface, UpdateTeamArgs} from './teamRepositoryInterface';
import {Membership, PrismaClient, Team} from '@prisma/client';

export class TeamRepository implements TeamRepositoryInterface {
    private prisma: PrismaClient;

    constructor(prisma: PrismaClient) {
        this.prisma = prisma;
    }

    createTeam({name, ownerId, maxMemberNumber, totalScore}: CreateTeamArgs): Promise<Team> {
        return this.prisma.team.create({
            data: {
                name,
                ownerId,
                maxMemberNumber,
                totalScore,
                member: 1,
                members: {
                    create:
                        {
                            membership: Membership.ACTIVE,
                            user: {
                                connect: {
                                    id: ownerId,
                                },
                            },
                        },
                },
            },
        });
    }

    deleteTeam(teamId: string): Promise<Team> {
        return this.prisma.team.delete({
            where: {
                id: teamId,
            },
        });
    }

    listTeams(): Promise<Array<Team>> {
        return this.prisma.team.findMany();
    }

    getTeam(teamId: string): Promise<Team | null> {
        return this.prisma.team.findFirst({
            where: {
                id: teamId,
            },
        });
    }

    getTeamMember(teamId: string): Promise<GetTeamMember | null> {
        return this.prisma.team.findFirst({
            where: {
                id: teamId,
            },
            include: {
                members: {
                    include: {
                        user: true,
                    },
                },
            },
        });
    }

    updateTeam({name, maxMemberNumber, totalScore, id}: UpdateTeamArgs): Promise<Team> {
        return this.prisma.team.update({
            where: {
                id,
            },
            data: {
                name,
                maxMemberNumber,
                totalScore,
            },
        });
    }
}