import { Module } from '@nestjs/common';
import { SiweService } from './siwe.service';
import { SiweController } from './siwe.controller';
import { CacheModule } from '@nestjs/cache-manager';

@Module({
  imports: [CacheModule.register()],
  providers: [SiweService],
  controllers: [SiweController],
  exports: [SiweService],
})
export class SiweModule {}
