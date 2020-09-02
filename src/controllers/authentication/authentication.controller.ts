// Uncomment these imports to begin using these cool features!

import { UserRepository } from '../../repositories';
import { User } from '../../models';
import * as bcrypt from 'bcryptjs';
import { LoginInput, SignUpInput } from './auth.input.model';
import { isNullOrUndefined } from 'util';
import {authenticate, TokenService} from '@loopback/authentication';
import {
  Credentials,
  MyUserService,
  TokenServiceBindings,
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
    @repository(UserRepository)
    public userRepository : UserRepository
  ) {}

  @post('/auth/signup', {
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
    userInput: SignUpInput,
  ): Promise<User> {
    //check if email already exists
    const emailFound = await this.userRepository.find({ 
      where: { email : userInput.email },
      fields: {id:true}
    });
    if (!isNullOrUndefined(emailFound) && emailFound.length > 0){
      throw new Error('The email already exists');
    }

    var user = {
      email : userInput.email,
      password: userInput.password?userInput.password:Math.random().toString(36).slice(-10),
      firstname : userInput.firstname,
      lastname : userInput.lastname,
      role : 'ADMIN'
    };

    // var pw = user.password?user.password:Math.random().toString(36).slice(-10);
    user.password = await hash(user.password, await genSalt());//await bcrypt.hash(user.password, 5);

    const userCreated: User = await this.userRepository.create(user);
    delete userCreated.password;
    return userCreated;
  }

  @post('/auth/login', {
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
            title: 'LoginInput'
          }),
        },
      },
    })
    login: LoginInput
  ): Promise<any> {
    const userFound = await this.userRepository.find({ 
      where: { email : login.email },
      fields: {id:true,email:true,password:true}
    });
    
    if (isNullOrUndefined(userFound) || userFound.length == 0){
      throw new Error('No account found for the email');
    }

    //check if password is valid
    var pwValid = false;
    pwValid = await bcrypt.compare(login.password, userFound[0].password);

    if (!pwValid){
      throw new Error('The password is not valid!');
    }

    const userProfile : UserProfile = {
      [securityId]: userFound[0].id.toString(),
      email: userFound[0].email,
      name: userFound[0].role, 
    };

    const token = await this.jwtService.generateToken(userProfile);

    return {token : token};
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
    console.log('currentUserProfile');
    console.log(currentUserProfile);
    return currentUserProfile[securityId];
  }
  
  /*********************
   * 
   * 
   * 
   * 
   * 
   */

}
