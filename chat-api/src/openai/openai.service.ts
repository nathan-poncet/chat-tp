import { Injectable } from '@nestjs/common';
import OpenAI from 'openai';
import { Uploadable } from 'openai/uploads';

@Injectable()
export class OpenAIService {
  constructor(private readonly openai: OpenAI) {}

  async chatCompletionsText(prompt: string, content: string): Promise<string> {
    const response = await this.openai.chat.completions.create({
      model: 'gpt-3.5-turbo',
      messages: [
        {
          role: 'system',
          content: prompt,
        },
        {
          role: 'user',
          content: content,
        },
      ],
    });

    return response.choices[0].message.content;
  }

  async chatCompletionsJSON(prompt: string, content: string): Promise<string> {
    const response = await this.openai.chat.completions.create({
      model: 'gpt-3.5-turbo-1106',
      response_format: { type: 'json_object' },
      messages: [
        {
          role: 'system',
          content: prompt,
        },
        {
          role: 'user',
          content: content,
        },
      ],
    });

    return response.choices[0].message.content;
  }

  async audioTranscriptions(file: Uploadable): Promise<string> {
    const response = await this.openai.audio.transcriptions.create({
      model: 'whisper-1',
      file: file,
    });

    return response.text;
  }
}
