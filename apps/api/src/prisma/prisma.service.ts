import {
  INestMicroservice,
  Injectable,
  Logger,
  OnModuleInit,
} from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { PrismaClient } from '@prisma/client';

@Injectable()
export class PrismaService extends PrismaClient implements OnModuleInit {
  private readonly logger = new Logger(PrismaService.name);

  constructor(private readonly config: ConfigService) {
    const url = config.get('DATABASE_URL');

    super({
      datasources: {
        db: {
          url,
        },
      },
    });
  }

  async onModuleInit() {
    this.logger.log('Initialising database connection');

    await this.$connect();
  }

  async enableShutdownHooks(app: INestMicroservice) {
    this.logger.log('Closing database connection');

    this.$on('beforeExit', async () => {
      await app.close();
    });
  }
}
