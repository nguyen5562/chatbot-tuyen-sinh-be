import {
  Controller,
  Get,
  Post,
  Put,
  Delete,
  Body,
  Param,
  ValidationPipe,
  Request,
  Response,
} from '@nestjs/common';
import { UserService } from './user.service';
import { CreateUserDTO } from './dto/create-user.dto';
import { UpdateUserDTO } from './dto/update-user.dto';
import { User } from '../../../generated/prisma';
import { ApiResponse } from '../../helper/response.helper';
import { ResponseCode, ResponseMessage } from '../../const/response.const';

@Controller('user')
export class UserController {
  constructor(private readonly userService: UserService) {}

  @Get()
  async getAll(@Response() res): Promise<User[]> {
    const ans = await this.userService.getAllUser();
    return ApiResponse(res, ResponseCode.SUCCESS, ResponseMessage.SUCCESS, ans);
  }

  @Get(':id')
  async getById(@Param('id') id: string, @Response() res): Promise<User> {
    const ans = await this.userService.getUserById(id);
    return ApiResponse(res, ResponseCode.SUCCESS, ResponseMessage.SUCCESS, ans);
  }

  @Post()
  async create(
    @Body(ValidationPipe) createUserDTO: CreateUserDTO,
    @Response() res,
  ): Promise<User> {
    const ans = await this.userService.createUser(createUserDTO);
    return ApiResponse(res, ResponseCode.CREATED, ResponseMessage.SUCCESS, ans);
  }

  @Put(':id')
  async update(
    @Param('id') id: string,
    @Body(ValidationPipe) updateUserDTO: UpdateUserDTO,
    @Response() res,
  ): Promise<User> {
    const ans = await this.userService.updateUser(id, updateUserDTO);
    return ApiResponse(res, ResponseCode.SUCCESS, ResponseMessage.SUCCESS, ans);
  }

  @Delete(':id')
  async delete(@Param('id') id: string, @Response() res): Promise<void> {
    await this.userService.deleteUser(id);
    return ApiResponse(res, ResponseCode.SUCCESS, ResponseMessage.SUCCESS);
  }
}
