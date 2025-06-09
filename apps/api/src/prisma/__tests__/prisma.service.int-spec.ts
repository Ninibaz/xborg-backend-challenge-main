import { Test, TestingModule } from '@nestjs/testing';
import { PrismaService } from './prisma.service';
import { ConfigService } from '@nestjs/config';
import { INestMicroservice } from '@nestjs/common';

describe('PrismaService (integration)', () => {
  let service: PrismaService;
  let module: TestingModule;

  beforeAll(async () => {
    // Use SQLite in-memory DB for integration test
    const configService = {
      get: (key: string) => {
        if (key === 'DATABASE_URL') return 'file:memory:?cache=shared';
        return null;
      },
    } as ConfigService;

    module = await Test.createTestingModule({
      providers: [
        PrismaService,
        { provide: ConfigService, useValue: configService },
      ],
    }).compile();

    service = module.get<PrismaService>(PrismaService);
  });

  afterAll(async () => {
    await service.$disconnect();
    await module.close();
  });

  it('should connect to the test database', async () => {
    await expect(service.$connect()).resolves.not.toThrow();
    // Optionally, check a simple query (list tables)
    const tables = await service.$queryRawUnsafe<any[]>(
      "SELECT name FROM sqlite_master WHERE type='table'"
    );
    expect(Array.isArray(tables)).toBe(true);
  });

  it('should run onModuleInit and connect', async () => {
    await expect(service.onModuleInit()).resolves.not.toThrow();
  });

  it('should register and call shutdown hook', async () => {
    // Mock microservice
    const app: INestMicroservice = { close: jest.fn() } as any;
    let beforeExitCb: Function | undefined;
    // Spy on $on to capture callback
    jest.spyOn(service, '$on').mockImplementation((event, cb) => {
      if (event === 'beforeExit') beforeExitCb = cb;
      return service;
    });
    await service.enableShutdownHooks(app);
    expect(beforeExitCb).toBeDefined();
    if (beforeExitCb) {
      await beforeExitCb();
      expect(app.close).toHaveBeenCalled();
    }
  });
});
