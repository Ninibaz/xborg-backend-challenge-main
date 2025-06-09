import { Test, TestingModule } from '@nestjs/testing';
import { INestApplication } from '@nestjs/common';
import { AppModule } from '../../app.module';
import { PrismaService } from '../../prisma/prisma.service';
import { ClientProxy, ClientsModule, Transport } from '@nestjs/microservices';
import { SignUpCall, GetUserCall, SignUpDTO, GetUserDTO } from 'lib-server';
import { User } from '../../prisma/types/user.types';

const TEST_USER: SignUpDTO = {
  address: '0xappmodule',
  userName: 'appmoduleuser',
  email: 'appmodule@example.com',
  firstName: 'App',
  lastName: 'Module',
};

describe('AppModule (integration)', () => {
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
            name: 'APP_SERVICE',
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
    client = app.get<ClientProxy>('APP_SERVICE');
    prisma = app.get(PrismaService);
  });

  afterAll(async () => {
    await prisma.$disconnect();
    await app.close();
  });

  it('should compile and wire all modules', () => {
    expect(app).toBeDefined();
    expect(prisma).toBeDefined();
  });

  it('should allow user signup and retrieval through the whole stack', async () => {
    // Signup
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
    // Retrieve
    const dto: GetUserDTO = { address: TEST_USER.address };
    const found: User = await client.send(GetUserCall, dto).toPromise();
    expect(found).toMatchObject({
      address: TEST_USER.address,
      userName: TEST_USER.userName,
      email: TEST_USER.email,
    });
  });
});
