import { Test, TestingModule } from '@nestjs/testing';
import { INestApplication } from '@nestjs/common';
import { AppModule } from '../../app.module';
import { PrismaService } from '../../prisma/prisma.service';
import { ClientProxy, ClientsModule, Transport } from '@nestjs/microservices';
import { SignUpCall, GetUserCall, SignUpDTO, GetUserDTO } from 'lib-server';
import { User } from '../../prisma/types/user.types';

const TEST_USER: SignUpDTO = {
  address: '0xe2euser',
  userName: 'e2euser',
  email: 'e2euser@example.com',
  firstName: 'E2E',
  lastName: 'User',
};

describe('App E2E (full repository)', () => {
  let app: INestApplication;
  let client: ClientProxy;
  let prisma: PrismaService;

  beforeAll(async () => {
    process.env.DATABASE_URL = 'file:memory:?cache=shared';
    const moduleFixture: TestingModule = await Test.createTestingModule({
      imports: [
        AppModule,
        ClientsModule.register([
          {
            name: 'E2E_SERVICE',
            transport: Transport.TCP,
          },
        ]),
      ],
    }).compile();

    app = moduleFixture.createNestApplication();
    app.connectMicroservice({
      transport: Transport.TCP,
    });
    await app.startAllMicroservices();
    await app.init();
    client = app.get<ClientProxy>('E2E_SERVICE');
    prisma = app.get(PrismaService);
  });

  afterAll(async () => {
    await prisma.$disconnect();
    await app.close();
  });

  it('should register a new user', async () => {
    const user: User = await client.send(SignUpCall, TEST_USER).toPromise();
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

  it('should not allow duplicate user registration', async () => {
    await expect(client.send(SignUpCall, TEST_USER).toPromise()).rejects.toThrow();
  });

  it('should retrieve the registered user', async () => {
    const dto: GetUserDTO = { address: TEST_USER.address };
    const user: User = await client.send(GetUserCall, dto).toPromise();
    expect(user).toMatchObject({
      address: TEST_USER.address,
      userName: TEST_USER.userName,
      email: TEST_USER.email,
    });
  });

  it('should return error for non-existent user', async () => {
    const dto: GetUserDTO = { address: 'notfound' };
    await expect(client.send(GetUserCall, dto).toPromise()).rejects.toThrow();
  });

});
