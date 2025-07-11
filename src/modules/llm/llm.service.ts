import { Injectable } from '@nestjs/common';
import axios from 'axios';
import * as readline from 'readline';
import { Readable } from 'stream';
import { modelConfig } from '../../config/env.config';

@Injectable()
export class LLMService {
  private readonly modelApiUrl = modelConfig.url;

  async generateCompletion(prompt: string): Promise<string> {
    const body = {
      content: prompt,
      stream: false,
    };

    const res = await axios.post(this.modelApiUrl, body);
    return res.data.response || '[Empty]';
  }

  async *streamCompletion(prompt: string): AsyncGenerator<string> {
    const body = {
      content: prompt,
      stream: false,
    };

    const response = await axios.post(this.modelApiUrl, body, {
      responseType: 'stream',
    });

    const rl = readline.createInterface({
      input: response.data as Readable,
      crlfDelay: Infinity,
    });

    for await (const line of rl) {
      if (line.trim()) {
        yield line;
      }
    }
  }
}
