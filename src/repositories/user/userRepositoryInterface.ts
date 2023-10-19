import {User} from '@prisma/client';

export type CreateUserArgs = {
  email: string;
  name: string;
  passwordHash: string;
  rank: number;
  score: number;
}

export interface UserRepositoryInterface {
  createUser({name, passwordHash, rank, score}: CreateUserArgs): Promise<User>;

  getUsers(): Promise<Array<User>>;

  getUserByEmail(email: string): Promise<User | null>;

  getUser(userId: string): Promise<User | null>;
}