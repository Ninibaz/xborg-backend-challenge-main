import { Controller, Logger } from '@nestjs/common';

import { GetUserCall, GetUserDTO, SignUpCall, SignUpDTO } from 'lib-server';

import { MessagePattern } from '@nestjs/microservices';
import { User } from '../prisma/types/user.types';
import { UserRepository } from './user.repository';
import { UserService } from './user.service';

@Controller('user')
export class UserController {
  private readonly logger = new Logger(UserController.name);

  constructor(
    private readonly service: UserService,
    private readonly repository: UserRepository,
  ) {}

  @MessagePattern(GetUserCall)
  async getUser({ id, address }: GetUserDTO): Promise<User> {
    this.logger.log(`Retrieving user ${id || address}`);
    return this.repository.find({ id, address });
  }

  @MessagePattern(SignUpCall)
  async signup(request: SignUpDTO): Promise<User> {
    return this.service.signup(request);
  }
}
