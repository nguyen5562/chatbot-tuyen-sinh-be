import { Module } from '@nestjs/common';
import { LLMService } from './llm.service';

@Module({
  imports: [],
  controllers: [],
  providers: [LLMService],
  exports: [LLMService],
})
export class LLMModule {}
