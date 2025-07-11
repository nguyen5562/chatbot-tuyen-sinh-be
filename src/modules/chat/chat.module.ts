import { Module } from '@nestjs/common';
import { ChatService } from './chat.service';
import { MessageModule } from '../message/message.module';
import { UserModule } from '../user/user.module';
import { ChatController } from './chat.controller';

@Module({
  imports: [MessageModule, UserModule],
  controllers: [ChatController],
  providers: [ChatService],
  exports: [ChatService],
})
export class ChatModule {}
