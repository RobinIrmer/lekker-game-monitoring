import {Membership, TeamMember, User} from '@prisma/client';

export type Invitation = TeamMember & { user: User };

export interface InvitationRepositoryInterface {
  createInvitation(userId: string, teamId: string): Promise<Invitation>;

  listInvitations(teamId: string): Promise<Array<Invitation>>;

  updateMembership(userId: string, teamId: string, membership: Membership): Promise<Invitation>;
}