import { Test, TestingModule } from '@nestjs/testing';
import { StubbedInstance, stubInterface } from 'ts-sinon';

import { UserRepository } from '../user.repository';
import { UserService } from '../user.service';
import { mockSignupRequest, mockUser } from './mocks';

describe('UserService', () => {
  let userService: UserService;

  const mockUserRepository: StubbedInstance<UserRepository> =
    stubInterface<UserRepository>();

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        {
          provide: UserRepository,
          useValue: mockUserRepository,
        },
        UserService,
      ],
    }).compile();

    userService = module.get<UserService>(UserService);
  });

  describe('signup', () => {
    it('should successfully signup user', async () => {
      mockUserRepository.create.resolves(mockUser);

      const authResponse = await userService.signup(mockSignupRequest);

      expect(authResponse).toEqual(mockUser);
    });
  });
});
