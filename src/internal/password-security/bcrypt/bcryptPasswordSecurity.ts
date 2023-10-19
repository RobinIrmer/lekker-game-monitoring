import bcrypt from 'bcrypt';
import {PasswordSecurity} from '../passwordSecurity';

export class BcryptPasswordSecurity implements PasswordSecurity {
  async compare(password: string, passwordHash: string): Promise<boolean> {
    return await bcrypt.compare(password, passwordHash);
  }

  async hash(password: string): Promise<string> {
    return await bcrypt.hash(password, 4);
  }

}