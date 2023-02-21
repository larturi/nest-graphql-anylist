import { Resolver, Query, Mutation, Args } from '@nestjs/graphql';
import { UseGuards } from '@nestjs/common';

import { JwtAuthGuard } from 'src/auth/guards/jwt-auth.guard';

import { ListItemsService } from './list-items.service';
import { ListItem } from './entities/list-item.entity';

import { CreateListItemInput } from './dto/create-list-item.input';

@Resolver(() => ListItem)
@UseGuards(JwtAuthGuard)
export class ListItemsResolver {
  constructor(private readonly listItemsService: ListItemsService) {}

  @Mutation(() => ListItem)
  async createListItem(
    @Args('createListItemInput') createListItemInput: CreateListItemInput,
  ): Promise<ListItem> {
    return this.listItemsService.create(createListItemInput);
  }

  @Query(() => [ListItem], { name: 'listItems' })
  findAll() {
    return this.listItemsService.findAll();
  }

  // @Query(() => ListItem, { name: 'listItem' })
  // findOne(@Args('id', { type: () => Int }) id: number) {
  //   return this.listItemsService.findOne(id);
  // }

  // @Mutation(() => ListItem)
  // updateListItem(@Args('updateListItemInput') updateListItemInput: UpdateListItemInput) {
  //   return this.listItemsService.update(updateListItemInput.id, updateListItemInput);
  // }

  // @Mutation(() => ListItem)
  // removeListItem(@Args('id', { type: () => Int }) id: number) {
  //   return this.listItemsService.remove(id);
  // }
}
