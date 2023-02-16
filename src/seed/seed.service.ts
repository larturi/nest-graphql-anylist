import { Injectable, UnauthorizedException } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { InjectRepository } from '@nestjs/typeorm';
import { Item } from '../items/entities/item.entity';
import { User } from '../users/entities/user.entity';
import { Repository } from 'typeorm';
import { ValidEnviroments } from './enums/valid-enviromente.enum';

@Injectable()
export class SeedService {
  private isProduction: boolean;

  constructor(
    private readonly configService: ConfigService,

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
}
