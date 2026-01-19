import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
  UseInterceptors,
  Put,
  HttpStatus,
  HttpCode,
  UseGuards,
} from '@nestjs/common';
import { UsersService } from './users.service';
import { CreateUserDto } from './dto/create-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';
import { UserResponseInterceptor } from './interceptors/user-response.interceptor';
import { ResponseMessage } from 'src/common/decorators/response-message.decorator';
import { USER_MESSAGES } from 'src/common/constants/message.constant';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';

@UseInterceptors(UserResponseInterceptor)
@Controller({
  path: 'users',
  version: '1',
})
export class UsersController {
  constructor(private readonly usersService: UsersService) {}

  @Post()
  @ResponseMessage(USER_MESSAGES.CREATED)
  create(@Body() createUserDto: CreateUserDto) {
    return this.usersService.create(createUserDto);
  }

  @UseGuards(JwtAuthGuard)
  @Get()
  @ResponseMessage(USER_MESSAGES.FOUND_ALL)
  findAll() {
    return this.usersService.findAll();
  }

  @Get(':id')
  @ResponseMessage(USER_MESSAGES.FOUND_ONE)
  findOne(@Param('id') id: string) {
    return this.usersService.findOne(id);
  }

  @Put(':id')
  @ResponseMessage(USER_MESSAGES.UPDATED)
  update(@Param('id') id: string, @Body() updateUserDto: UpdateUserDto) {
    return this.usersService.update(id, updateUserDto);
  }

  @Patch(':id')
  @ResponseMessage(USER_MESSAGES.PATCHED)
  patch(@Param('id') id: string, @Body() updateUserDto: UpdateUserDto) {
    return this.usersService.update(id, updateUserDto);
  }

  @Delete(':id')
  @HttpCode(HttpStatus.NO_CONTENT)
  @ResponseMessage(USER_MESSAGES.DELETED)
  remove(@Param('id') id: string) {
    return this.usersService.remove(id);
  }
}
