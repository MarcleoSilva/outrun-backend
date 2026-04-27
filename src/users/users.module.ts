import { Module } from '@nestjs/common';
import { UsersController } from './controllers/users.controller';
import { ServiceService } from './service/service.service';

@Module({
  controllers: [UsersController],
  providers: [ServiceService]
})
export class UsersModule {}
