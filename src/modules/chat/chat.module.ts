import { Module } from '@nestjs/common';
import { ChatService } from './chat.service';
import { MessageModule } from '../message/message.module';
import { UserModule } from '../user/user.module';

@Module({
  imports: [MessageModule, UserModule],
  controllers: [],
  providers: [ChatService],
  exports: [ChatService],
})
export class ChatModule {}
