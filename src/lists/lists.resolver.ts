import {
  Resolver,
  Query,
  Mutation,
  Args,
  ID,
  ResolveField,
  Parent,
} from '@nestjs/graphql';
import { ParseUUIDPipe, UseGuards } from '@nestjs/common';

import { ListsService } from './lists.service';
import { ListItemsService } from '../list-items/list-items.service';

import { List } from './entities/list.entity';
import { User } from 'src/users/entities/user.entity';
import { ListItem } from '../list-items/entities/list-item.entity';

import { CreateListInput } from './dto/create-list.input';
import { UpdateListInput } from './dto/update-list.input';

import { PaginationArgs, SearchArgs } from 'src/common/dto/args';
import { JwtAuthGuard } from 'src/auth/guards/jwt-auth.guard';
import { CurrentUser } from 'src/auth/decorators/current-user.decorator';

@Resolver(() => List)
@UseGuards(JwtAuthGuard)
export class ListsResolver {
  constructor(
    private readonly listsService: ListsService,
    private readonly listsItemsService: ListItemsService,
  ) {}

  @Mutation(() => List)
  async createList(
    @CurrentUser() user: User,
    @Args('createListInput') createListInput: CreateListInput,
  ): Promise<List> {
    return this.listsService.create(createListInput, user);
  }

  @Query(() => [List], { name: 'lists' })
  async findAll(
    @CurrentUser() user: User,
    @Args() paginationArgs: PaginationArgs,
    @Args() searchArgs: SearchArgs,
  ): Promise<List[]> {
    return this.listsService.findAll(user, paginationArgs, searchArgs);
  }

  @Query(() => List, { name: 'list' })
  async findOne(
    @Args('id', { type: () => ID }, ParseUUIDPipe) id: string,
    @CurrentUser() user: User,
  ): Promise<List> {
    return this.listsService.findOne(id, user);
  }

  @Mutation(() => List)
  async updateList(
    @Args('updateListInput') updateListInput: UpdateListInput,
    @CurrentUser() user: User,
  ) {
    return this.listsService.update(updateListInput.id, updateListInput, user);
  }

  @Mutation(() => List)
  async removeList(
    @Args('id', { type: () => ID }) id: string,
    @CurrentUser() user: User,
  ): Promise<List> {
    return this.listsService.remove(id, user);
  }

  @ResolveField(() => [ListItem], { name: 'items' })
  async getListItems(
    @Parent() list: List,
    @Args() paginationArgs: PaginationArgs,
    @Args() searchArgs: SearchArgs,
  ): Promise<ListItem[]> {
    return this.listsItemsService.findAll(list, paginationArgs, searchArgs);
  }

  @ResolveField(() => Number, { name: 'totalItems' })
  async countListItemsByList(@Parent() list: List): Promise<number> {
    return this.listsItemsService.countListItemsByList(list);
  }
}
