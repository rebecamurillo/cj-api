// Uncomment these imports to begin using these cool features!

import { UsersRepository } from '../../repositories';
import { Users } from '../../models';
import * as bcrypt from 'bcryptjs';
import { LoginInput, SignUpInput } from './auth.input.model';
import { isNullOrUndefined } from 'util';
import {authenticate, TokenService} from '@loopback/authentication';
import {
  Credentials,
  MyUserService,
  TokenServiceBindings,
  User,
  UserRepository,
  UserServiceBindings,
} from '@loopback/authentication-jwt';
import {inject} from '@loopback/core';
import {model, property, repository} from '@loopback/repository';
import {get, getModelSchemaRef, post, requestBody} from '@loopback/rest';
import {SecurityBindings, securityId, UserProfile} from '@loopback/security';
import {genSalt, hash} from 'bcryptjs';
import _ from 'lodash';


@model()
export class NewUserRequest extends User {
  @property({
    type: 'string',
    required: true,
  })
  password: string;
}

const CredentialsSchema = {
  type: 'object',
  required: ['email', 'password'],
  properties: {
    email: {
      type: 'string',
      format: 'email',
    },
    password: {
      type: 'string',
      minLength: 8,
    },
  },
};
export const CredentialsRequestBody = {
  description: 'The input of login function',
  required: true,
  content: {
    'application/json': {schema: CredentialsSchema},
  },
};

export class AuthenticationController {
  constructor(
    @inject(TokenServiceBindings.TOKEN_SERVICE)
    public jwtService: TokenService,
    @inject(UserServiceBindings.USER_SERVICE)
    public userService: MyUserService,
    @inject(SecurityBindings.USER, {optional: true})
    public user: UserProfile,
    @repository(UserRepository) protected userRepository: UserRepository,
    @repository(UsersRepository)
    public usersRepository : UsersRepository
  ) {}

  @post('/auth/admin/signup', {
    responses: {
      '200': {
        description: 'User model instance',
        content: {'application/json': {schema: getModelSchemaRef(User)}},
      },
    },
  })
  async adminSignUp(
    @requestBody({
      content: {
        'application/json': {
          schema: getModelSchemaRef(SignUpInput, {
            title: 'SignUp'
          })
        },
      },
    })
    userInput: Omit<SignUpInput, 'id'>,
    //@requestBody(CredentialsRequestBody) credentials: Credentials,

  ): Promise<User> {
    var user = {
      email : userInput.email,
      password: userInput.password?userInput.password:Math.random().toString(36).slice(-10),
      firstname : userInput.firstname,
      lastname : userInput.lastname,
      role : 'ADMIN',
      createdAt : new Date(),
      updatedAt : new Date()
    };
    // };
    // user.email = userInput.email;
    // user.firstname = userInput.firstname;
    // user.lastname = userInput.lastname;
    // user.role = 'ADMIN';
    // user.createdAt = new Date();
    // user.updatedAt = new Date();

    // var pw = user.password?user.password:Math.random().toString(36).slice(-10);
    user.password = await bcrypt.hash(user.password, 5);

    return this.userRepository.create(user);
  }

  @post('/auth/admin/login', {
    responses: {
      '200': {
        description: 'User model instance',
        content: {'application/json': {schema: getModelSchemaRef(User)}},
      },
    },
  })
  async adminLogin(
    @requestBody({
      content: {
        'application/json': {
          schema: getModelSchemaRef(LoginInput, {
            title: 'Login'
          }),
        },
      },
    })
    login: Omit<LoginInput,'id'>,
  ): Promise<any> {
    const userFound = await this.userRepository.find({ 
      where: { email : login.email },
      fields: {id:true,email:true,password:true}
    });

    console.log('LOGIN user found');
    console.log(userFound);
    
    if (isNullOrUndefined(userFound) || userFound.length == 0){
      throw new Error('The email is not found');
    }

    //check if password is valid
    var pwValid = false;
    try {
      pwValid = await bcrypt.compare(login.password, userFound[0].password);
    } catch (e) {
      console.error(e);
    }

    const userProfile : UserProfile = {
      email: userFound[0].email,
      name: userFound[0].role, 
      [securityId]: userFound[0].id
    };

    const token = await this.jwtService.generateToken(userProfile);

    return token;
  }

  
  /*********************
   * 
   * 
   * 
   * 
   * 
   */

  @post('/users/login', {
    responses: {
      '200': {
        description: 'Token',
        content: {
          'application/json': {
            schema: {
              type: 'object',
              properties: {
                token: {
                  type: 'string',
                },
              },
            },
          },
        },
      },
    },
  })
  async login(
    @requestBody(CredentialsRequestBody) credentials: Credentials,
  ): Promise<{token: string}> {
    // ensure the user exists, and the password is correct
    const user = await this.userService.verifyCredentials(credentials);
    // convert a User object into a UserProfile object (reduced set of properties)
    const userProfile = this.userService.convertToUserProfile(user);

    // create a JSON Web Token based on the user profile
    const token = await this.jwtService.generateToken(userProfile);
    return {token};
  }

  @authenticate('jwt')
  @get('/whoAmI', {
    responses: {
      '200': {
        description: '',
        schema: {
          type: 'string',
        },
      },
    },
  })
  async whoAmI(
    @inject(SecurityBindings.USER)
    currentUserProfile: UserProfile,
  ): Promise<string> {
    return currentUserProfile[securityId];
  }

  @post('/signup', {
    responses: {
      '200': {
        description: 'User',
        content: {
          'application/json': {
            schema: {
              'x-ts-type': User,
            },
          },
        },
      },
    },
  })
  async signUp(
    @requestBody({
      content: {
        'application/json': {
          schema: getModelSchemaRef(NewUserRequest, {
            title: 'NewUser',
          }),
        },
      },
    })
    newUserRequest: NewUserRequest,
  ): Promise<User> {
    const password = await hash(newUserRequest.password, await genSalt());
    const savedUser = await this.userRepository.create(
      _.omit(newUserRequest, 'password'),
    );

    await this.userRepository.userCredentials(savedUser.id).create({password});

    return savedUser;
  }
}
