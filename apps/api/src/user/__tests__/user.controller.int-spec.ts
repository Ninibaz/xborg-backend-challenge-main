import { Test, TestingModule } from '@nestjs/testing';
import { INestApplication } from '@nestjs/common';
import { ClientProxy, ClientsModule, Transport } from '@nestjs/microservices';
import { AppModule } from '../../app.module';
import { PrismaService } from '../../prisma/prisma.service';
import { User } from '../../prisma/types/user.types';
import { SignUpCall, GetUserCall, SignUpDTO, GetUserDTO } from 'lib-server';

const TEST_USER: SignUpDTO = {
  address: '0xtestaddress',
  userName: 'testuser',
  email: 'testuser@example.com',
  firstName: 'Test',
  lastName: 'User',
};

describe('UserController (integration)', () => {
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
            name: 'USER_SERVICE',
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
    client = app.get<ClientProxy>('USER_SERVICE');
    prisma = app.get(PrismaService);
  });

  afterAll(async () => {
    await prisma.$disconnect();
    await app.close();
  });

  it('should signup a user', async () => {
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

  it('should not allow duplicate signup (unique constraint)', async () => {
    await expect(client.send(SignUpCall, TEST_USER).toPromise()).rejects.toThrow();
  });

  it('should retrieve the user by address', async () => {
    const dto: GetUserDTO = { address: TEST_USER.address };
    const user: User = await client.send(GetUserCall, dto).toPromise();
    expect(user).toMatchObject({
      address: TEST_USER.address,
      userName: TEST_USER.userName,
      email: TEST_USER.email,
    });
  });

  it('should return error for not found user', async () => {
    const dto: GetUserDTO = { address: 'nonexistent' };
    await expect(client.send(GetUserCall, dto).toPromise()).rejects.toThrow();
  });
});
