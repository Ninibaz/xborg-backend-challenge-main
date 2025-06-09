import { Test, TestingModule } from '@nestjs/testing';
import { UserService } from '../user.service';
import { UserRepository } from '../user.repository';
import { PrismaService } from '../../prisma/prisma.service';
import { ConfigService } from '@nestjs/config';
import { User } from '../../prisma/types/user.types';

const TEST_USER = {
  address: '0xserviceuser',
  userName: 'serviceuser',
  email: 'serviceuser@example.com',
  firstName: 'Service',
  lastName: 'User',
};

describe('UserService (integration)', () => {
  let service: UserService;
  let repository: UserRepository;
  let prisma: PrismaService;
  let module: TestingModule;

  beforeAll(async () => {
    const configService = {
      get: (key: string) => {
        if (key === 'DATABASE_URL') return 'file:memory:?cache=shared';
        return null;
      },
    } as ConfigService;

    module = await Test.createTestingModule({
      providers: [
        UserService,
        UserRepository,
        PrismaService,
        { provide: ConfigService, useValue: configService },
      ],
    }).compile();

    service = module.get(UserService);
    repository = module.get(UserRepository);
    prisma = module.get(PrismaService);
    await prisma.$connect();
  });

  afterAll(async () => {
    await prisma.$disconnect();
    await module.close();
  });

  it('should signup a new user', async () => {
    const user = await service.signup(TEST_USER);
    expect(user).toMatchObject({
      address: TEST_USER.address,
      userName: TEST_USER.userName,
      email: TEST_USER.email,
      profile: expect.objectContaining({
        firstName: TEST_USER.firstName,
        lastName: TEST_USER.lastName,
      }),
    });
  });

  it('should not allow duplicate signup (unique constraint)', async () => {
    await expect(service.signup(TEST_USER)).rejects.toThrow();
  });

  it('should find user by address', async () => {
    const user = await repository.find({ address: TEST_USER.address });
    expect(user).toMatchObject({
      address: TEST_USER.address,
      userName: TEST_USER.userName,
      email: TEST_USER.email,
    });
  });

  it('should throw NotFoundException for non-existent user', async () => {
    await expect(repository.find({ address: 'doesnotexist' })).rejects.toThrow();
  });
});
