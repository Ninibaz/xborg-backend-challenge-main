import { Controller, Get, Logger, Param } from '@nestjs/common';
import { SiweService } from './siwe.service';
import { GetNonceDTO } from './types/siwe.dto';

@Controller('siwe')
export class SiweController {
  private readonly logger = new Logger(SiweController.name);

  constructor(private readonly siweService: SiweService) {}

  @Get('/nonce/:address')
  async getNonce(@Param() { address }: GetNonceDTO): Promise<string> {
    this.logger.log('Get nonce request');

    return this.siweService.createNonce(address);
  }
}
