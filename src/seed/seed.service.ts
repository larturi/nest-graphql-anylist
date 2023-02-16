import { Injectable, UnauthorizedException } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { InjectRepository } from '@nestjs/typeorm';
import { Item } from '../items/entities/item.entity';
import { User } from '../users/entities/user.entity';
import { Repository } from 'typeorm';
import { ValidEnviroments } from './enums/valid-enviromente.enum';
import { SEED_USERS, SEED_ITEMS } from './data/seed-data';
import { UsersService } from '../users/users.service';
import { ItemsService } from '../items/items.service';

@Injectable()
export class SeedService {
  private isProduction: boolean;

  constructor(
    private readonly configService: ConfigService,

    private readonly usersService: UsersService,

    private readonly itemsService: ItemsService,

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

    const user = await this.loadUsers();

    await this.loadItems(user);

    return true;
  }

  async deleteDatabase() {
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
}
