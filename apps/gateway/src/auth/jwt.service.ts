import { Injectable } from '@nestjs/common';
import { JwtService as NestJwtService } from '@nestjs/jwt';

import { AuthResponseDTO } from '../user/types/auth.dto';

@Injectable()
export class JwtService {
  constructor(private readonly jwt: NestJwtService) {}

  async buildAuthRes({ id }: { id: string }): Promise<AuthResponseDTO> {
    const token = await this.jwt.signAsync({ id });
    return { token };
  }
}
