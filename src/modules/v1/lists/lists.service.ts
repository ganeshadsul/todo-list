import { Injectable, NotFoundException } from '@nestjs/common';
import { CreateListDto } from './dto/create-list.dto';
import { UpdateListDto } from './dto/update-list.dto';
import { InjectModel } from '@nestjs/mongoose';
import { List as ListModel } from './schemas/list.schema';
import { Model } from 'mongoose';
import { UserDocument } from '../users/schemas/user.schema';

@Injectable()
export class ListsService {
  constructor(
    @InjectModel(ListModel.name) private readonly List: Model<ListModel>,
  ) {}

  async create(createListDto: CreateListDto, user: UserDocument) {
    const { title, description } = createListDto;
    const lists = await this.List.create({
      title,
      description,
      createdBy: user._id,
      updatedBy: user._id,
    });
    return lists;
  }

  async findAll() {
    const list = await this.List.find()
      .populate('createdBy', 'firstName lastName email')
      .populate('updatedBy', 'firstName lastName email');
    return list;
  }

  async findOne(id: string) {
    const list = await this.List.findById(id);
    if (!list) throw new NotFoundException('List not found');
    return list;
  }

  async update(id: string, updateListDto: UpdateListDto, user: UserDocument) {
    const { title, description, isImportant, isCompleted } = updateListDto;
    const list = await this.List.findByIdAndUpdate(
      id,
      {
        $set: {
          title,
          description,
          isImportant,
          isCompleted,
          updatedBy: user.id,
        },
      },
      {
        new: true,
        runValidators: true,
      },
    );
    return list;
  }

  async remove(id: string, user: UserDocument) {
    return await this.List.findByIdAndUpdate(id, {
      $set: { deletedAt: new Date(), updatedBy: user.id },
    });
  }
}
