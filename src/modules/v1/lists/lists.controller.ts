import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
  UseGuards,
  Req,
  Put,
  HttpCode,
  HttpStatus,
} from '@nestjs/common';
import { ListsService } from './lists.service';
import { CreateListDto } from './dto/create-list.dto';
import { UpdateListDto } from './dto/update-list.dto';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import { ResponseMessage } from 'src/common/decorators/response-message.decorator';
import { UserDocument } from '../users/schemas/user.schema';
import { LIST_MESSAGES } from 'src/common/constants/message.constant';

@UseGuards(JwtAuthGuard)
@Controller({
  path: 'list',
  version: '1',
})
export class ListsController {
  constructor(private readonly listsService: ListsService) {}

  @Post()
  @ResponseMessage(LIST_MESSAGES.CREATED)
  create(
    @Body() createListDto: CreateListDto,
    @Req() req: { user: UserDocument },
  ) {
    return this.listsService.create(createListDto, req.user);
  }

  @Get()
  @ResponseMessage(LIST_MESSAGES.FOUND_ALL)
  findAll(@Req() req: { user: UserDocument }) {
    return this.listsService.findAll(req.user);
  }

  @Get(':id')
  @ResponseMessage(LIST_MESSAGES.FOUND_ONE)
  findOne(@Param('id') id: string, @Req() req: { user: UserDocument }) {
    return this.listsService.findOne(id, req.user);
  }

  @Put(':id')
  @ResponseMessage(LIST_MESSAGES.UPDATED)
  update(
    @Param('id') id: string,
    @Body() updateListDto: UpdateListDto,
    @Req() req: { user: UserDocument },
  ) {
    return this.listsService.update(id, updateListDto, req.user);
  }

  @Patch(':id')
  @ResponseMessage(LIST_MESSAGES.PATCHED)
  patch(
    @Param('id') id: string,
    @Body() updateListDto: UpdateListDto,
    @Req() req: { user: UserDocument },
  ) {
    return this.listsService.update(id, updateListDto, req.user);
  }

  @Delete(':id')
  @HttpCode(HttpStatus.NO_CONTENT)
  @ResponseMessage(LIST_MESSAGES.DELETED)
  remove(@Param('id') id: string, @Req() req: { user: UserDocument }) {
    return this.listsService.remove(id, req.user);
  }
}
