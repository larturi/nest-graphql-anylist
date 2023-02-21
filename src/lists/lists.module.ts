import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ListsService } from './lists.service';
import { ListItemsModule } from '../list-items/list-items.module';
import { ListsResolver } from './lists.resolver';
import { List } from './entities/list.entity';

@Module({
  providers: [ListsResolver, ListsService],
  imports: [TypeOrmModule.forFeature([List]), ListItemsModule],
  exports: [TypeOrmModule, ListsService],
})
export class ListsModule {}
