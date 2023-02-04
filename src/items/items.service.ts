import { Injectable } from '@nestjs/common';
import { CreateItemInput } from './dto/create-item.input';
import { UpdateItemInput } from './dto/update-item.input';

@Injectable()
export class ItemsService {
  create(createItemInput: CreateItemInput) {
    return createItemInput;
  }

  findAll() {
    return [];
  }

  findOne(id: number) {
    return `This action returns a #${id} item`;
  }

  update(id: number, updateItemInput: UpdateItemInput) {
    return updateItemInput;
  }

  remove(id: number) {
    return `This action removes a #${id} item`;
  }
}
