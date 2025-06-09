import { CACHE_MANAGER } from '@nestjs/cache-manager';
import {
  HttpException,
  Inject,
  Injectable,
  Logger,
  UnauthorizedException,
} from '@nestjs/common';
import { Cache } from 'cache-manager';
import { SiweMessage, generateNonce } from 'siwe';
import { ONE_MINUTE } from './constants';

@Injectable()
export class SiweService {
  private readonly logger = new Logger(SiweService.name);

  constructor(@Inject(CACHE_MANAGER) private cacheManager: Cache) {}

  async createNonce(address: string): Promise<string> {
    const nonce = generateNonce();

    await this.cacheManager.set(address.toLocaleLowerCase(), nonce, ONE_MINUTE);

    return nonce;
  }

  async verifyMessage(
    message: string,
    signature: string,
  ): Promise<SiweMessage> {
    this.logger.log('Verifying siwe message');
    const siweMessage = new SiweMessage(message);

    const cacheNonce = await this.cacheManager.get(
      siweMessage.address.toLocaleLowerCase(),
    );

    if (!cacheNonce || cacheNonce !== siweMessage.nonce) {
      this.logger.error(
        `Provided nonce: ${siweMessage.nonce}, does not match nonce in cache: ${cacheNonce}, for address: ${siweMessage.address}`,
      );
      throw new HttpException('Invalid nonce', 422);
    }

    try {
      await siweMessage.verify({ signature, nonce: siweMessage.nonce });

      await this.cacheManager.del(siweMessage.address);

      return siweMessage;
    } catch (error) {
      this.logger.error(`Failed to validate siwe message. Error: ${error}`);
      throw new UnauthorizedException();
    }
  }
}
