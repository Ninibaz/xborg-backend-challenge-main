import {
  Body,
  Controller,
  Get,
  Logger,
  Post,
  Request,
  UnauthorizedException,
  UseGuards,
} from '@nestjs/common';

import { UserClientAPI, UserDTO } from 'lib-server';

import { JwtGuard } from '../auth/guards/jwt.guard';
import { JwtService } from '../auth/jwt.service';
import { SiweService } from '../siwe/siwe.service';
import { AuthResponseDTO, LoginDTO, SignUpDTO } from './types/auth.dto';

@Controller('user')
export class UserController {
  private readonly logger = new Logger(UserController.name);

  constructor(
    private readonly jwtService: JwtService,
    private readonly userAPI: UserClientAPI,
    private readonly siweService: SiweService,
  ) {}

  @Get()
  @UseGuards(JwtGuard)
  async getUser(@Request() req): Promise<UserDTO> {
    this.logger.log(`Get user: ${req.user.id}`);

    return this.userAPI.getUser({ id: req.user.id });
  }

  @Post('/signup')
  async signup(
    @Body() { message, signature, ...body }: SignUpDTO,
  ): Promise<AuthResponseDTO> {
    this.logger.log(`Signup user requested`);

    const verified = await this.siweService.verifyMessage(message, signature);
    const user = await this.userAPI.signUp({
      ...body,
      address: verified.address,
    });

    return this.jwtService.buildAuthRes(user);
  }

  @Post('/login')
  async login(
    @Body() { message, signature }: LoginDTO,
  ): Promise<AuthResponseDTO> {
    this.logger.log(`Login user request`);

    try {
      const verified = await this.siweService.verifyMessage(message, signature);
      const user = await this.userAPI.getUser({ address: verified.address });

      return this.jwtService.buildAuthRes(user);
    } catch {
      throw new UnauthorizedException();
    }
  }
}
