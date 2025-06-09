import { Module } from '@nestjs/common';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { JwtModule } from '@nestjs/jwt';

import { ClientApiModule } from 'lib-server';

import { AuthModule } from './auth/auth.module';
import { envConfig } from './config/env/env-config';
import { signOptions } from './config/jwt/jwt.config';
import { SiweModule } from './siwe/siwe.module';
import { UserModule } from './user/user.module';

@Module({
  imports: [
    ConfigModule.forRoot({
      load: [envConfig],
      cache: true,
      isGlobal: true,
    }),
    JwtModule.registerAsync({
      global: true,
      imports: [ConfigModule],
      useFactory: async (config: ConfigService) => ({
        secret: config.get('JWT.SECRET'),
        signOptions,
      }),

      inject: [ConfigService],
    }),
    ClientApiModule,
    AuthModule,
    SiweModule,
    UserModule,
  ],
})
export class AppModule {}
