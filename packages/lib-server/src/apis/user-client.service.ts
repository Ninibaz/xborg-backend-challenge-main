import { Inject } from '@nestjs/common';
import { ClientProxy } from '@nestjs/microservices';
import { firstValueFrom } from 'rxjs';

import { SignUpCall, SignUpDTO } from '../models/auth.model';
import { GetUserCall, GetUserDTO, UserDTO } from '../models/user.model';
import { API_SERVICE } from './constants';

export interface UserClient {
  getUser(request: GetUserDTO): Promise<UserDTO>;

  signUp(request: SignUpDTO): Promise<UserDTO>;
}

export class UserClientAPI implements UserClient {
  constructor(@Inject(API_SERVICE) private readonly client: ClientProxy) {}

  async getUser(request: GetUserDTO): Promise<UserDTO> {
    return firstValueFrom(
      this.client.send<UserDTO, GetUserDTO>(GetUserCall, request)
    );
  }

  async signUp(request: SignUpDTO): Promise<UserDTO> {
    return firstValueFrom(
      this.client.send<UserDTO, SignUpDTO>(SignUpCall, request)
    );
  }
}
