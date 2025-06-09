import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';

import { envConfig } from './config/env/env-config';
import { PrismaModule } from './prisma/prisma.module';
import { UserModule } from './user/user.module';

@Module({
  imports: [
    ConfigModule.forRoot({
      load: [envConfig],
      cache: true,
      isGlobal: true,
    }),
    PrismaModule,
    UserModule,
  ],
})
export class AppModule {}
