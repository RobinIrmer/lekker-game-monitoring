import {CreateUserArgs, UserRepositoryInterface} from './userRepositoryInterface';
import {Membership, PrismaClient, User} from '@prisma/client';

export class UserRepository implements UserRepositoryInterface {
  private prisma: PrismaClient;

  constructor(prisma: PrismaClient) {
    this.prisma = prisma;
  }

  async createUser({email, name, passwordHash, rank, score}: CreateUserArgs): Promise<User> {
    return await this.prisma.user.create({
      data: {
        email,
        name,
        passwordHash,
        rank,
        score,
      },
    });
  }

  getUsers(): Promise<Array<User>> {
    return this.prisma.user.findMany();
  }

  getUserByEmail(email: string): Promise<User | null> {
    return this.prisma.user.findFirst({
      where: {
        email,
      },
    });
  }

  getUser(userId: string): Promise<User | null> {
    return this.prisma.user.findFirst({
      where: {
        id: userId,
      },
    });
  }

  updateMembership(userId: string, teamId: string, membership: Membership) {
    this.prisma.teamMember.update({
      where: {
        teamId_userId: {
          userId,
          teamId,
        },
      },
      data: {
        membership,
      },
    });
  }
}