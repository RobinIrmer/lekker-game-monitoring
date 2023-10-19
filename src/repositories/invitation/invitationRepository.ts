import {Membership, PrismaClient} from '@prisma/client';
import {Invitation, InvitationRepositoryInterface} from './invitationsRepositoryInterface';

export class InvitationRepository implements InvitationRepositoryInterface {
  private prisma: PrismaClient;

  constructor(prisma: PrismaClient) {
    this.prisma = prisma;
  }

  listInvitations(teamId: string): Promise<Array<Invitation>> {
    return this.prisma.teamMember.findMany({
      where: {
        teamId,
        membership: Membership.REQUESTED,
      },
      include: {
        user: true,
      },
    });
  }

  updateMembership(userId: string, teamId: string, membership: Membership): Promise<Invitation> {
    return this.prisma.teamMember.update({
      where: {
        teamId_userId: {
          teamId,
          userId,
        },
      },
      data: {
        membership,
      },
      include: {
        user: true,
      },
    });
  }

  createInvitation(userId: string, teamId: string): Promise<Invitation> {
    return this.prisma.teamMember.create({
      data: {
        userId,
        teamId,
        membership: Membership.REQUESTED,
      },
      include: {
        user: true,
      },
    });
  }
}