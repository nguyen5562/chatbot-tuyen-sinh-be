import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  Post,
  Request,
  Response,
  UseGuards,
  ValidationPipe,
} from '@nestjs/common';
import { ChatService } from './chat.service';
import { CreateChatDTO } from './dto/create-chat.dto';
import { Chat, Message } from '../../../generated/prisma';
import { ChatDTO } from './dto/chat.dto';
import { ApiResponse } from '../../helper/response.helper';
import { ResponseCode, ResponseMessage } from '../../const/response.const';
import { CreateMessageDTO } from '../message/dto/create-message.dto';
import { JwtAuthGuard } from '../../guards/jwt-auth.guard';

@Controller('chat')
export class ChatController {
  constructor(private readonly chatService: ChatService) {}

  @Post(':id')
  async createChat(
    @Param('id') id: string,
    @Body(ValidationPipe) createChatDTO: CreateChatDTO,
    @Response() res,
  ): Promise<Chat> {
    const ans = await this.chatService.createChat(id, createChatDTO);
    return ApiResponse(res, ResponseCode.CREATED, ResponseMessage.SUCCESS, ans);
  }

  @Get(':id')
  async getChat(@Param('id') id: string): Promise<ChatDTO> {
    return await this.chatService.getChat(id);
  }

  @Get('by-user/:id')
  async getUserChats(@Param('id') id: string): Promise<Chat[]> {
    return await this.chatService.getUserChats(id);
  }

  @Delete(':id')
  async deleteChat(@Param('id') id: string) {
    await this.chatService.deleteChat(id);
  }

  @UseGuards(JwtAuthGuard)
  @Post('send-message/:id')
  async sendMessage(
    @Param('id') id: string,
    @Body(ValidationPipe) createMessageDTO: CreateMessageDTO,
    @Request() req,
  ): Promise<Message> {
    const userId = req.user.id as string;

    return await this.chatService.sendMessage(userId, id, createMessageDTO);
  }
}
