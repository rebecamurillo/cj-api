import { UserService } from '@loopback/authentication';
import { UserProfile } from '@loopback/security';
import { UserRepository } from '../../repositories';
import { User } from '../../models';

/**
 * A pre-defined type for user credentials. It assumes a user logs in
 * using the email and password. You can modify it if your app has different credential fields
 */
export declare type Credentials = {
    email: string;
    password: string;
};

export class AuthService {
    userRepository: UserRepository;
    constructor(userRepository: UserRepository){};

    async verifyCredentials(credentials: Credentials): Promise<User>{
      return new User();
    }

    async convertToUserProfile(user: User): Promise<User>{
      return new User();

    }
}
