import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { CreateListItemInput } from './dto/create-list-item.input';
// import { UpdateListItemInput } from './dto/update-list-item.input';
import { ListItem } from './entities/list-item.entity';

@Injectable()
export class ListItemsService {
  constructor(
    @InjectRepository(ListItem)
    private readonly ListItemsRepository: Repository<ListItem>,
  ) {}

  async create(createListItemInput: CreateListItemInput): Promise<ListItem> {
    const { itemId, listId, ...rest } = createListItemInput;
    const newListItem = this.ListItemsRepository.create({
      ...rest,
      item: { id: itemId },
      list: { id: listId },
    });
    return this.ListItemsRepository.save(newListItem);
  }

  async findAll(): Promise<ListItem[]> {
    return this.ListItemsRepository.find();
  }

  // findOne(id: number) {
  //   return `This action returns a #${id} listItem`;
  // }

  // update(id: number, updateListItemInput: UpdateListItemInput) {
  //   return `This action updates a #${id} listItem`;
  // }

  // remove(id: number) {
  //   return `This action removes a #${id} listItem`;
  // }
}
