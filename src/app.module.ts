import { Module } from '@nestjs/common';

import { UsersModule } from './users/users.module';
import { GroupsModule } from './groups/groups.module';
import { CardsModule } from './cards/cards.module';
import { PrismaModule } from './prisma/prisma.module';

@Module({
  imports: [UsersModule, GroupsModule, CardsModule, PrismaModule],
  controllers: [],
  providers: [],
})
export class AppModule {}
