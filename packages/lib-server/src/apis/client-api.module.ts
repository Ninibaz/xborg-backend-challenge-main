import { Global, Module } from '@nestjs/common';
import { ClientsModule, Transport } from '@nestjs/microservices';

import { UserClientAPI } from './user-client.service';
import { API_SERVICE } from './constants';

@Global()
@Module({
  imports: [
    ClientsModule.register([
      {
        name: API_SERVICE,
        transport: Transport.RMQ,
        options: {
          urls: ['amqp://xborg:password@localhost:36010'],
          queue: 'api_queue',
          queueOptions: {
            durable: true,
          },
        },
      },
    ]),
  ],
  providers: [UserClientAPI],
  exports: [UserClientAPI],
})
export class ClientApiModule {}
