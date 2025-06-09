import { Module } from '@nestjs/common';
import { SiweModule } from '../siwe/siwe.module';
import { UserController } from './user.controller';

@Module({
  imports: [SiweModule],
  controllers: [UserController],
})
export class UserModule {}
