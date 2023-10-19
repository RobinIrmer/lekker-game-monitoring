import {
  Auth,
  AuthenticationApiInterface,
  InitOverrideFunction,
  SigninPostRequest,
  SignupPostRequest
} from '../../../package/openapi';

import {UserRepositoryInterface} from '../../repositories';
import * as runtime from '../../../package/openapi/runtime';
import {Authentication, HttpError, PasswordSecurity} from '../../internal';
import {User} from '@prisma/client';

export class AuthService implements AuthenticationApiInterface {
    private userRepository: UserRepositoryInterface;
    private authentication: Authentication;
    private passwordSecurity: PasswordSecurity;

    constructor(userRepository: UserRepositoryInterface, authentication: Authentication, passwordSecurity: PasswordSecurity) {
        this.userRepository = userRepository;
        this.authentication = authentication;
        this.passwordSecurity = passwordSecurity;
    }

    public async signupPost(requestParameters: SignupPostRequest, initOverrides?: RequestInit | runtime.InitOverrideFunction): Promise<void> {
        const {name, email, password} = requestParameters.signupRequest;

        const existingUser: User | null = await this.userRepository.getUserByEmail(email);

        if (existingUser) {
            throw new HttpError('User already exists', 400);
        }

        const hashedPassword: string = await this.passwordSecurity.hash(password);

        await this.userRepository.createUser({
            email,
            name,
            passwordHash: hashedPassword,
            rank: 1,
            score: Math.floor(Math.random() * 200),
        });
    }

    public async signinPost(requestParameters: SigninPostRequest, initOverrides?: RequestInit | InitOverrideFunction): Promise<Auth> {
        const {email, password} = requestParameters.signinRequest;

        const user: User | null = await this.userRepository.getUserByEmail(email);

        if (!user) {
            throw new HttpError('Invalid credentials', 401);
        }

        const passwordMatch: boolean = await this.passwordSecurity.compare(password, user.passwordHash);

        if (!passwordMatch) {
            throw new HttpError('Invalid credentials', 401);
        }

        const token: string = this.authentication.sign(user.id);

        return {token};
    }
}