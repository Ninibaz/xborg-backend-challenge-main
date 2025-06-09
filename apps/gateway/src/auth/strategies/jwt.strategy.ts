import { Injectable, UnauthorizedException } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { PassportStrategy } from '@nestjs/passport';
import { ExtractJwt, Strategy } from 'passport-jwt';

import { UserClientAPI } from 'lib-server';

import { signOptions } from '../../config/jwt/jwt.config';

@Injectable()
export class JwtStrategy extends PassportStrategy(Strategy) {
  constructor(
    private readonly config: ConfigService,
    private readonly userAPI: UserClientAPI,
  ) {
    super({
      jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
      secretOrKey: config.get('JWT.SECRET'),
      ignoreExpiration: false,
      algorithms: [signOptions.algorithm],
    });
  }

  async validate({ id }: { id: string }): Promise<any> {
    const user = await this.userAPI.getUser({ id }).catch(() => {
      throw new UnauthorizedException();
    });

    if (!user) {
      throw new UnauthorizedException();
    }

    return user;
  }
}
