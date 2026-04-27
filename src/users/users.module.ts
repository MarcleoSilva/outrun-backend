import { Module } from '@nestjs/common';
import { UsersController } from './controllers/users.controller';
import { ServiceService } from './service/service.service';
import { PrismaModule } from 'src/prisma/prisma.module';

@Module({
  imports: [PrismaModule],
  controllers: [UsersController],
  providers: [ServiceService]
})
export class UsersModule {}
