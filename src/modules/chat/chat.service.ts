import {
  BadRequestException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { CreateChatDTO } from './dto/create-chat.dto';
import { UserService } from '../user/user.service';
import { ResponseMessage } from '../../const/response.const';
import {
  Chat,
  Message,
  MessageRole,
  PrismaClient,
} from '../../../generated/prisma';
import { ChatDTO } from './dto/chat.dto';
import { MessageService } from '../message/message.service';
import { CreateMessageDTO } from '../message/dto/create-message.dto';

@Injectable()
export class ChatService {
  private readonly prisma: PrismaClient;

  constructor(
    private readonly userService: UserService,
    private readonly messageService: MessageService,
  ) {
    this.prisma = new PrismaClient();
  }

  // Tạo một session chat mới cho user với model AI chỉ định.
  async createChat(
    userId: string,
    createChatDTO: CreateChatDTO,
  ): Promise<Chat> {
    const user = await this.userService.getUserById(userId);
    if (!user)
      throw new NotFoundException(
        ResponseMessage.NOT_FOUND + ' user có id là: ' + userId,
      );

    const newChat = await this.prisma.chat.create({
      data: {
        userId: userId,
        ...createChatDTO,
      },
    });

    return newChat;
  }

  // Lấy chi tiết một chat (bao gồm các message) của user.
  async getChat(chatId: string): Promise<ChatDTO> {
    const chat = await this.prisma.chat.findUnique({
      where: { id: chatId },
    });
    if (!chat)
      throw new NotFoundException(
        ResponseMessage.NOT_FOUND + ' chat có id là: ' + chatId,
      );

    const messages =
      await this.messageService.getByChatAndOrderByCreatedAtAsc(chatId);

    const chatDTO: ChatDTO = {
      ...chat,
      messages,
    };
    return chatDTO;
  }

  // Lấy danh sách các chat của user, có phân trang.
  async getUserChats(userId: string): Promise<Chat[]> {
    const user = await this.userService.getUserById(userId);
    if (!user)
      throw new NotFoundException(
        ResponseMessage.NOT_FOUND + ' user có id là: ' + userId,
      );

    const chats = await this.prisma.chat.findMany({
      where: { userId },
    });
    return chats;
  }

  // Xóa một chat (và toàn bộ message trong đó) của user.
  async deleteChat(chatId: string): Promise<void> {
    await this.messageService.deleteByChat(chatId);

    await this.prisma.chat.delete({
      where: { id: chatId },
    });
  }

  // Gửi một message vào chat, xác định vai trò (user/assistant), lưu message, cập nhật tiêu đề chat nếu cần.
  async sendMessage(
    userId: string,
    chatId: string,
    createMessageDTO: CreateMessageDTO,
  ): Promise<Message> {
    // Kiểm tra user và chat
    const user = await this.userService.getUserById(userId);
    if (!user)
      throw new NotFoundException(
        ResponseMessage.NOT_FOUND + ' user có id là: ' + userId,
      );

    const chat = await this.prisma.chat.findUnique({
      where: { id: chatId, userId },
    });
    if (!chat)
      throw new BadRequestException(
        'Không tìm thấy đoạn chat hoặc bạn không có quyền truy cập',
      );

    // Kiểm tra role của message
    let messageRole: MessageRole;

    const recentMessage =
      await this.messageService.getRecentMessageByChat(chatId);
    if (
      recentMessage === null ||
      recentMessage.role === MessageRole.ASSISTANT
    ) {
      messageRole = MessageRole.USER;
    } else {
      messageRole = MessageRole.ASSISTANT;
    }

    // Tạo message mới
    const newMessage = await this.messageService.createByChat(
      chatId,
      createMessageDTO,
      messageRole,
    );

    // Nếu đây là message user đầu tiên thì cập nhật title của đoạn chat
    if (newMessage.role === MessageRole.USER) {
      if (recentMessage === null || chat.title === 'New chat') {
        let newTitle = createMessageDTO.content;
        if (newTitle.length > 30) {
          newTitle = newTitle.substring(0, 27) + '...';
        }

        await this.prisma.chat.update({
          where: { id: chatId, userId },
          data: { title: newTitle },
        });
      }
    }

    return newMessage;
  }

  // Lấy toàn bộ message trong một chat của user.
  async getChatMessages(chatId: string): Promise<Message[]> {
    const messages =
      await this.messageService.getByChatAndOrderByCreatedAtAsc(chatId);
    return messages;
  }
}
