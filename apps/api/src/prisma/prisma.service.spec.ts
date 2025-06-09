import { Test, TestingModule } from '@nestjs/testing';
import { PrismaService } from './prisma.service';
import { ConfigService } from '@nestjs/config';
import { INestMicroservice, Logger } from '@nestjs/common';

jest.mock('@nestjs/common', () => {
  const actual = jest.requireActual('@nestjs/common');
  return {
    ...actual,
    Logger: jest.fn().mockImplementation(() => ({
      log: jest.fn(),
    })),
  };
});

describe('PrismaService', () => {
  let service: PrismaService;
  let configService: ConfigService;
  let logger: Logger;

  beforeEach(async () => {
    configService = {
      get: jest.fn().mockImplementation((key: string) => {
        if (key === 'DATABASE_URL') return 'test-db-url';
        return null;
      }),
    } as any;

    const module: TestingModule = await Test.createTestingModule({
      providers: [
        PrismaService,
        { provide: ConfigService, useValue: configService },
      ],
    }).compile();

    service = module.get<PrismaService>(PrismaService);
    logger = (service as any).logger;
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  it('should call logger.log and $connect on onModuleInit', async () => {
    const connectSpy = jest.spyOn(service, '$connect').mockResolvedValueOnce();
    const logSpy = jest.spyOn(logger, 'log');
    await service.onModuleInit();
    expect(logSpy).toHaveBeenCalledWith('Initialising database connection');
    expect(connectSpy).toHaveBeenCalled();
  });

  it('should register beforeExit hook and call app.close', async () => {
    const app = { close: jest.fn() } as unknown as INestMicroservice;
    const onSpy = jest.spyOn(service, '$on').mockImplementation((event, cb) => {
      if (event === 'beforeExit') {
        cb();
      }
      return service;
    });
    const logSpy = jest.spyOn(logger, 'log');
    await service.enableShutdownHooks(app);
    expect(logSpy).toHaveBeenCalledWith('Closing database connection');
    expect(onSpy).toHaveBeenCalledWith('beforeExit', expect.any(Function));
    expect(app.close).toHaveBeenCalled();
  });
});
