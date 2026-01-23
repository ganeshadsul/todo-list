import { Injectable, NotFoundException } from '@nestjs/common';
import { CreateListDto } from './dto/create-list.dto';
import { UpdateListDto } from './dto/update-list.dto';
import { InjectModel } from '@nestjs/mongoose';
import { List as ListModel } from './schemas/list.schema';
import { Model, Types } from 'mongoose';
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

  async findAll(user: UserDocument) {
    const list = await this.List.find({ createdBy: user._id })
      .populate('createdBy', 'firstName lastName email')
      .populate('updatedBy', 'firstName lastName email')
      .exec();
    return list;
  }

  async findOne(id: string, user: UserDocument) {
    const list = await this.List.findOne({
      _id: id,
      createdBy: user._id,
    }).exec();
    if (!list) throw new NotFoundException('List not found');
    return list;
  }

  async update(id: string, updateListDto: UpdateListDto, user: UserDocument) {
    const { title, description, isImportant, isCompleted } = updateListDto;
    const list = await this.List.findOneAndUpdate(
      { _id: id, createdBy: user.id },
      {
        $set: {
          title,
          description,
          isImportant,
          isCompleted,
          updatedBy: new Types.ObjectId(user.id),
        },
      },
      {
        new: true,
        runValidators: true,
      },
    ).exec();
    return list;
  }

  async remove(id: string, user: UserDocument) {
    return await this.List.findOneAndUpdate(
      { _id: id, createdBy: user._id },
      {
        $set: { deletedAt: new Date(), updatedBy: user.id },
      },
    );
  }
}
