import { Test, TestingModule } from '@nestjs/testing';
import { AppModule } from '../../app.module';
import { ConfigModule } from '@nestjs/config';
import { PrismaModule } from '../../prisma/prisma.module';
import { UserModule } from '../user.module';

describe('AppModule', () => {
  let module: TestingModule;

  beforeAll(async () => {
    module = await Test.createTestingModule({
      imports: [AppModule],
    }).compile();
  });

  it('should compile the module', () => {
    expect(module).toBeDefined();
    const appModule = module.get(AppModule);
    expect(appModule).toBeInstanceOf(AppModule);
  });

  it('should import ConfigModule, PrismaModule, and UserModule', () => {
    const imports = (AppModule as any).ɵmod?.imports || [];
    expect(imports.some((i: any) => i === ConfigModule)).toBeTruthy();
    expect(imports.some((i: any) => i === PrismaModule)).toBeTruthy();
    expect(imports.some((i: any) => i === UserModule)).toBeTruthy();
  });
});
