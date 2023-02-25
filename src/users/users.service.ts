import {
  BadRequestException,
  Injectable,
  InternalServerErrorException,
  Logger,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import * as bcrypt from 'bcryptjs';

import { SignupInput } from '../auth/dto/inputs/signup.input';
import { User } from './entities/user.entity';
import { ValidRoles } from '../auth/enums/valid-roles.enum';
import { UpdateItemInput } from '../items/dto/inputs';
import { PaginationArgs, SearchArgs } from '../common/dto/args';

@Injectable()
export class UsersService {
  private logger = new Logger('UsersService');

  constructor(
    @InjectRepository(User)
    private readonly usersRepository: Repository<User>,
  ) {}

  async create(signupInput: SignupInput): Promise<User> {
    try {
      const newUser = this.usersRepository.create({
        ...signupInput,
        password: bcrypt.hashSync(signupInput.password, 10),
      });
      return await this.usersRepository.save(newUser);
    } catch (error) {
      this.handleDBErrors(error);
    }
  }

  async findAll(
    roles: ValidRoles[],
    paginationArgs: PaginationArgs,
    searchArgs: SearchArgs,
  ): Promise<User[]> {
    const { limit, offset } = paginationArgs;
    const { search } = searchArgs;

    if (roles.length === 0)
      return this.usersRepository.find({
        relations: {
          lastUpdateBy: true,
        },
      });

    const queryBuilder = this.usersRepository
      .createQueryBuilder()
      .andWhere('ARRAY[roles] && ARRAY[:...roles]')
      .setParameter('roles', roles)
      .limit(limit)
      .take(offset);

    if (search) {
      queryBuilder.andWhere('LOWER("fullName") like :fullName', {
        fullName: `%${search.toLowerCase()}%`,
      });
    }

    return await queryBuilder.getMany();
  }

  async findOneByEmail(email: string): Promise<User> {
    try {
      return await this.usersRepository.findOneByOrFail({ email });
    } catch (error) {
      this.handleDBErrors({
        code: 'err-001',
        detail: 'Email / Password do not match',
      });
    }
  }

  async findOneById(id: string): Promise<User> {
    try {
      return await this.usersRepository.findOneByOrFail({ id });
    } catch (error) {
      this.handleDBErrors({
        code: 'err-002',
        detail: 'Id not found',
      });
    }
  }

  async update(
    id: string,
    updateUserInput: UpdateItemInput,
    updateBy: User,
  ): Promise<User> {
    try {
      const user = await this.usersRepository.preload({
        ...updateUserInput,
        id,
      });

      user.lastUpdateBy = updateBy;
      return await this.usersRepository.save(user);
    } catch (error) {
      this.handleDBErrors(error);
    }
  }

  async block(id: string, adminUser: User): Promise<User> {
    const userToBlock = await this.findOneById(id);
    userToBlock.isActive = false;
    userToBlock.lastUpdateBy = adminUser;
    return await this.usersRepository.save(userToBlock);
  }

  private handleDBErrors(error: any): never {
    if ((error.code = '23505')) {
      throw new BadRequestException(error.detail.replace('Key ', ''));
    }

    if ((error.code = 'err-001')) {
      throw new BadRequestException(error.detail.replace('Key ', ''));
    }

    this.logger.error(error);
    throw new InternalServerErrorException('Please check servers logs');
  }
}
