import { Global, Module } from '@nestjs/common';

import { JwtService } from './jwt.service';
import { JwtStrategy } from './strategies/jwt.strategy';

@Global()
@Module({
  providers: [JwtStrategy, JwtService],
  exports: [JwtService],
})
export class AuthModule {}
