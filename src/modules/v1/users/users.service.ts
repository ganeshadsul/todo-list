import { Injectable, NotFoundException } from '@nestjs/common';
import { CreateUserDto } from './dto/create-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';
import { InjectModel } from '@nestjs/mongoose';
import { User as UserModel } from './schemas/user.schema';
import { Model } from 'mongoose';
import { USER_MESSAGES } from 'src/common/constants/message.constant';
import { DE_ACTIVE } from 'src/common/constants/app.constant';
type SafeUpdate = Omit<UpdateUserDto, 'password' | 'passwordConfirm'>;

@Injectable()
export class UsersService {
  constructor(@InjectModel(UserModel.name) private User: Model<UserModel>) {}

  async create(createUserDto: CreateUserDto) {
    const { firstName, lastName, email, password, passwordConfirm } =
      createUserDto;
    const user = await this.User.create({
      firstName,
      lastName,
      email,
      password,
      passwordConfirm,
    });
    return user;
  }

  async findAll() {
    return await this.User.find();
  }

  async findOne(id: string) {
    const user = await this.User.findById(id);
    if (!user) throw new NotFoundException(USER_MESSAGES.NOT_FOUND(id));
    return user;
  }

  async update(id: string, updateUserDto: UpdateUserDto) {
    const { firstName, lastName, email } = updateUserDto;
    const safeData: SafeUpdate = { firstName, lastName, email };

    const user = await this.User.findByIdAndUpdate(
      id,
      { $set: safeData },
      {
        new: true,
        runValidators: true,
      },
    );
    return user;
  }

  async remove(id: string) {
    return await this.User.findByIdAndUpdate(id, {
      $set: { isActive: DE_ACTIVE, deletedAt: new Date() },
    });
  }
}
