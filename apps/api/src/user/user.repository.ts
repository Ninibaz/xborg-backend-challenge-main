import {
  HttpException,
  Injectable,
  InternalServerErrorException,
  Logger,
  NotFoundException,
} from '@nestjs/common';
import { Prisma } from '@prisma/client';

import { ERROR_CODES } from '../prisma/constants';
import { PrismaService } from '../prisma/prisma.service';
import { User, userArgs } from '../prisma/types/user.types';

@Injectable()
export class UserRepository {
  private readonly logger = new Logger(UserRepository.name);

  constructor(private readonly prisma: PrismaService) {}

  async find(where: Prisma.UserWhereUniqueInput): Promise<User> {
    return this.prisma.user
      .findUniqueOrThrow({ where, ...userArgs })
      .catch((error) => {
        this.logger.error(`Failed to find user, Error: ${error.message}`);
        throw new NotFoundException();
      });
  }

  async create(data: Prisma.UserCreateInput): Promise<User> {
    return this.prisma.user
      .create({
        data,
        ...userArgs,
      })
      .catch((error) => {
        if (error.code === ERROR_CODES.UNIQUE_CONSTRAINT) {
          this.logger.error(`User exists Error: ${error.message}`);
          throw new HttpException('User exists', 409);
        }
        this.logger.error(`Failed to create user, Error: ${error.message}`);
        throw new InternalServerErrorException(`Failed to create user`);
      });
  }
}
