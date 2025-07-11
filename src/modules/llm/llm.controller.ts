import { Body, Controller, Post, Sse, ValidationPipe } from '@nestjs/common';
import { LLMService } from './llm.service';
import { CreateMessageDTO } from '../message/dto/create-message.dto';

@Controller('llm')
export class LLMController {
  constructor(private readonly llmService: LLMService) {}

  @Post()
  async generateCompletion(
    @Body(ValidationPipe) createMessageDTO: CreateMessageDTO,
  ) {
    return await this.llmService.generateCompletion(createMessageDTO.content);
  }

  @Sse('stream')
  streamCompletion(
    @Body(ValidationPipe) createMessageDTO: CreateMessageDTO,
  ): AsyncGenerator<MessageEvent> {
    const stream = this.llmService.streamCompletion(createMessageDTO.content);

    return (async function* () {
      for await (const chunk of stream) {
        yield new MessageEvent('message', { data: chunk });
      }
    })();
  }
}
