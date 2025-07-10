import { IsNotEmpty, IsOptional, IsString } from 'class-validator';

export class CreateChatDTO {
  @IsString()
  @IsNotEmpty()
  title: string = 'New chat';

  @IsString()
  @IsOptional()
  description?: string;

  @IsString()
  @IsNotEmpty()
  model: string = 'Vinallama-2.7b-chat';
}
