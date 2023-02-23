import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { SeedService } from './seed.service';
import { SeedResolver } from './seed.resolver';
import { UsersModule } from './../users/users.module';
import { ItemsModule } from './../items/items.module';
import { ListItemsModule } from './../list-items/list-items.module';
import { ListsModule } from './../lists/lists.module';

@Module({
  providers: [SeedResolver, SeedService],
  imports: [
    ConfigModule,
    UsersModule,
    ItemsModule,
    ListItemsModule,
    ListsModule,
  ],
})
export class SeedModule {}
