import {InitOverrideFunction, User, UserFromJSONTyped, UserManagementApiInterface} from '../../../package/openapi';
import {UserRepositoryInterface} from '../../repositories';

export class UserService implements UserManagementApiInterface {
    private userRepository: UserRepositoryInterface;

    constructor(userRepository: UserRepositoryInterface) {
        this.userRepository = userRepository;
    }

    async usersGet(initOverrides?: RequestInit | InitOverrideFunction): Promise<Array<User>> {
        const users = await this.userRepository.getUsers();
        return users.map((user) => UserFromJSONTyped(user, false));
    }
}
