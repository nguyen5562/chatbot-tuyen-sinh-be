import type { Chat, Message } from '../../../../generated/prisma';

export class ChatDTO implements Chat {
  id: string;
  model: string;
  createdAt: Date;
  updatedAt: Date;
  title: string | null;
  description: string | null;
  userId: string;
  // ... các trường khác của ChatDTO ...

  messages: Message[];
}
