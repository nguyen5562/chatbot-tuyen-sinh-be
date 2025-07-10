import { Injectable } from '@nestjs/common';
import { Message, MessageRole, PrismaClient } from '../../../generated/prisma';
import { CreateMessageDTO } from './dto/create-message.dto';

@Injectable()
export class MessageService {
  private readonly prisma: PrismaClient;

  constructor() {
    this.prisma = new PrismaClient();
  }

  async getByChatAndOrderByCreatedAtAsc(chatId: string): Promise<Message[]> {
    const messages = this.prisma.message.findMany({
      where: { chatId },
      orderBy: { createdAt: 'asc' },
    });
    return messages;
  }

  async getRecentMessageByChat(chatId: string): Promise<Message | null> {
    const message = this.prisma.message.findFirst({
      where: { chatId },
      orderBy: { createdAt: 'desc' },
    });
    return message;
  }

  async deleteByChat(chatId: string): Promise<void> {
    await this.prisma.message.deleteMany({
      where: { chatId },
    });
  }

  async createByChat(
    chatId: string,
    createMessageDTO: CreateMessageDTO,
    role: MessageRole,
  ): Promise<Message> {
    const message = await this.prisma.message.create({
      data: {
        ...createMessageDTO,
        chatId,
        role,
      },
    });
    return message;
  }
}
