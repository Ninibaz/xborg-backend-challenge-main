import { Test, TestingModule } from '@nestjs/testing';
import { INestApplication } from '@nestjs/common';
import { AppModule } from '../../app.module';
import { PrismaService } from '../../prisma/prisma.service';
import { ClientProxy, ClientsModule, Transport } from '@nestjs/microservices';
import { SignUpCall, GetUserCall, SignUpDTO, GetUserDTO } from 'lib-server';
import { User } from '../../prisma/types/user.types';
import { performance } from 'perf_hooks';

const TEST_USER: SignUpDTO = {
  address: '0xbenchmark',
  userName: 'benchmark',
  email: 'benchmark@example.com',
  firstName: 'Bench',
  lastName: 'Mark',
};

describe('Performance Benchmarks (E2E)', () => {
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
            name: 'BENCH_SERVICE',
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
    client = app.get<ClientProxy>('BENCH_SERVICE');
    prisma = app.get(PrismaService);
  });

  afterAll(async () => {
    await prisma.$disconnect();
    await app.close();
  });

  it('registers a user within 200ms', async () => {
    const start = performance.now();
    const user: User = await client.send(SignUpCall, TEST_USER).toPromise();
    const duration = performance.now() - start;
    console.log(`User registration took ${duration.toFixed(2)}ms`);
    expect(duration).toBeLessThan(200);
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

  it('rejects duplicate registration within 200ms', async () => {
    const start = performance.now();
    await expect(client.send(SignUpCall, TEST_USER).toPromise()).rejects.toThrow();
    const duration = performance.now() - start;
    console.log(`Duplicate registration took ${duration.toFixed(2)}ms`);
    expect(duration).toBeLessThan(200);
  });

  it('retrieves the user within 200ms', async () => {
    const dto: GetUserDTO = { address: TEST_USER.address };
    const start = performance.now();
    const user: User = await client.send(GetUserCall, dto).toPromise();
    const duration = performance.now() - start;
    console.log(`User retrieval took ${duration.toFixed(2)}ms`);
    expect(duration).toBeLessThan(200);
    expect(user).toMatchObject({
      address: TEST_USER.address,
      userName: TEST_USER.userName,
      email: TEST_USER.email,
    });
  });

  it('returns error for not found user within 200ms', async () => {
    const dto: GetUserDTO = { address: 'notfound' };
    const start = performance.now();
    await expect(client.send(GetUserCall, dto).toPromise()).rejects.toThrow();
    const duration = performance.now() - start;
    console.log(`Not found retrieval took ${duration.toFixed(2)}ms`);
    expect(duration).toBeLessThan(200);
  });
});
