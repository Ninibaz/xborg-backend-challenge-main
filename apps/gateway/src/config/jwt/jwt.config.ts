import { JwtSignOptions } from '@nestjs/jwt';

export const signOptions: JwtSignOptions = {
  expiresIn: '1d',
  algorithm: 'HS512',
};
