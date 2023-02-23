import { Injectable, UnauthorizedException } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';

import { Item } from '../items/entities/item.entity';
import { User } from '../users/entities/user.entity';
import { List } from '../lists/entities/list.entity';
import { ListItem } from '../list-items/entities/list-item.entity';

import { ValidEnviroments } from './enums/valid-enviromente.enum';
import { SEED_USERS, SEED_ITEMS, SEED_LISTS } from './data/seed-data';

import { UsersService } from '../users/users.service';
import { ItemsService } from '../items/items.service';
import { ListsService } from '../lists/lists.service';
import { ListItemsService } from '../list-items/list-items.service';

@Injectable()
export class SeedService {
  private isProduction: boolean;

  constructor(
    private readonly configService: ConfigService,
    private readonly usersService: UsersService,
    private readonly itemsService: ItemsService,
    private readonly listsService: ListsService,
    private readonly listsItemsService: ListItemsService,

    @InjectRepository(List)
    private readonly listRepository: Repository<List>,

    @InjectRepository(ListItem)
    private readonly listItemsRepository: Repository<ListItem>,

    @InjectRepository(Item)
    private readonly itemsRepository: Repository<Item>,

    @InjectRepository(User)
    private readonly usersRepository: Repository<User>,
  ) {
    this.isProduction = configService.get('STATE') === ValidEnviroments.prod;
  }

  async executeSeed() {
    if (this.isProduction)
      throw new UnauthorizedException('We can not run the Seed on Production');

    await this.deleteDatabase();

    // Crear Users
    const user = await this.loadUsers();

    // Crear Items
    await this.loadItems(user);

    // Crear Lists
    const list = await this.loadLists(user);

    // Crear ListItems
    const itemsList1 = await this.itemsService.findAll(
      user,
      { limit: 10, offset: 0 },
      {},
    );
    await this.loadListItems(list[0], itemsList1);

    const itemsList2 = await this.itemsService.findAll(
      user,
      { limit: 5, offset: 0 },
      {},
    );
    await this.loadListItems(list[1], itemsList2);

    const itemsList3 = await this.itemsService.findAll(
      user,
      { limit: 7, offset: 0 },
      {},
    );
    await this.loadListItems(list[2], itemsList3);

    return true;
  }

  async deleteDatabase() {
    // Borrar los ListItems
    await this.listItemsRepository
      .createQueryBuilder()
      .delete()
      .where({})
      .execute();

    // Borrar los Lists
    await this.listRepository.createQueryBuilder().delete().where({}).execute();

    // Borra los items de la base de datos
    await this.itemsRepository
      .createQueryBuilder()
      .delete()
      .where({})
      .execute();

    // Borra los usuarios de la base de datos
    await this.usersRepository
      .createQueryBuilder()
      .delete()
      .where({})
      .execute();
  }

  async loadUsers(): Promise<User> {
    const users = [];

    for (const user of SEED_USERS) {
      users.push(await this.usersService.create(user));
    }
    return users[0];
  }

  async loadItems(user: User): Promise<void> {
    const itemsPromises = [];

    for (const item of SEED_ITEMS) {
      itemsPromises.push(await this.itemsService.create(item, user));
    }

    await Promise.all(itemsPromises);
  }

  async loadLists(user: User): Promise<List[]> {
    const lists = [];

    for (const list of SEED_LISTS) {
      lists.push(await this.listsService.create(list, user));
    }
    return lists;
  }

  async loadListItems(list: List, items: Item[]) {
    for (const item of items) {
      await this.listsItemsService.create({
        quantity: Math.round(Math.random() * 10),
        completed: Math.round(Math.random() * 1) === 0 ? false : true,
        listId: list.id,
        itemId: item.id,
      });
    }
  }
}
