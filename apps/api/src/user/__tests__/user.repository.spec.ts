import { Test, TestingModule } from '@nestjs/testing';
import { HttpException, NotFoundException } from '@nestjs/common';
import { StubbedInstance, stubInterface } from 'ts-sinon';

import { UserRepository } from '../user.repository';
import { PrismaService } from '../../prisma/prisma.service';
import { ERROR_CODES } from '../../prisma/constants';
import { mockCreateUser, mockUser } from './mocks';

describe('UserRepository', () => {
  let userRepository: UserRepository;

  const mockPrismaService: StubbedInstance<PrismaService> =
    stubInterface<PrismaService>();

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        {
          provide: PrismaService,
          useValue: mockPrismaService,
        },
        UserRepository,
      ],
    }).compile();

    userRepository = module.get<UserRepository>(UserRepository);
  });

  describe('find', () => {
    it('should successfully find user', async () => {
      mockPrismaService.user.findUniqueOrThrow = jest
        .fn()
        .mockResolvedValue(mockUser);
      const user = await userRepository.find({ id: mockUser.id });

      expect(user).toEqual(mockUser);
    });

    it('should return a NotFoundException for an invalid id', async () => {
      mockPrismaService.user.findUniqueOrThrow = jest
        .fn()
        .mockRejectedValue(new NotFoundException());

      await expect(userRepository.find({ id: 'invalidId' })).rejects.toThrow(
        new NotFoundException(),
      );
    });
  });

  describe('create', () => {
    it('should successfully create user', async () => {
      mockPrismaService.user.create = jest.fn().mockResolvedValue(mockUser);
      const user = await userRepository.create(mockCreateUser);

      expect(user).toEqual(mockUser);
    });

    it('should fail to create user with UNIQUE_CONSTRAINT code', async () => {
      const error = new Error() as any;
      error.code = ERROR_CODES.UNIQUE_CONSTRAINT;
      mockPrismaService.user.create = jest.fn().mockRejectedValue(error);

      await expect(userRepository.create(mockCreateUser)).rejects.toThrow(
        new HttpException('User exists', 409),
      );
    });

    it('should fail to create user with error code', async () => {
      const error = new Error('Error') as any;
      error.code = 404;
      mockPrismaService.user.create = jest.fn().mockRejectedValue(error);

      await expect(userRepository.create(mockCreateUser)).rejects.toThrow(
        new Error('Failed to create user'),
      );
    });
  });
});
