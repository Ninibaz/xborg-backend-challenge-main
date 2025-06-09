import { INestMicroservice } from '@nestjs/common';
import { NestFactory } from '@nestjs/core';
import { PrismaService } from '../../prisma/prisma.service';

jest.mock('@nestjs/core');

const mockEnableShutdownHooks = jest.fn();
const mockListen = jest.fn();
const mockGet = jest.fn();

const mockApp = {
  get: mockGet,
  listen: mockListen,
} as unknown as INestMicroservice;

describe('bootstrap', () => {
  beforeEach(() => {
    jest.clearAllMocks();
    (NestFactory.createMicroservice as jest.Mock).mockResolvedValue(mockApp);
    mockGet.mockImplementation((token: any) => {
      if (token === PrismaService) {
        return { enableShutdownHooks: mockEnableShutdownHooks };
      }
      return undefined;
    });
  });

  it('should start the microservice and setup shutdown hooks', async () => {
    // Import the bootstrap function after mocks are set up
    const consoleLogSpy = jest.spyOn(console, 'log').mockImplementation();
    const { default: runBootstrap } = await import('../../main');
    // Wait for the bootstrap to finish
    await new Promise((r) => setTimeout(r, 10));

    expect(NestFactory.createMicroservice).toHaveBeenCalled();
    expect(mockGet).toHaveBeenCalledWith(PrismaService);
    expect(mockEnableShutdownHooks).toHaveBeenCalledWith(mockApp);
    expect(mockListen).toHaveBeenCalled();
    expect(consoleLogSpy).toHaveBeenCalledWith('API Microservice is listening');
    consoleLogSpy.mockRestore();
  });
});

// Patch: Export a dummy default to allow dynamic import
export default undefined;
