import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ListItemsService } from './list-items.service';
import { ListItemsResolver } from './list-items.resolver';
import { ListItem } from './entities/list-item.entity';

@Module({
  providers: [ListItemsResolver, ListItemsService],
  imports: [TypeOrmModule.forFeature([ListItem])],
  exports: [ListItemsService, TypeOrmModule],
})
export class ListItemsModule {}
