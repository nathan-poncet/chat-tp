import { Injectable } from '@nestjs/common';
import {
  createReadStream,
  existsSync,
  mkdirSync,
  unlinkSync,
  writeFileSync,
} from 'fs';
import { join } from 'path';
import { OpenAIService } from 'src/openai/openai.service';

@Injectable()
export class TranscriptionService {
  constructor(private readonly openaiService: OpenAIService) {}

  async transcriptAudio(audioBuffer: Buffer): Promise<{
    buffer: Buffer;
    content: string;
  }> {
    const tempDirectory = './temp';
    const audioFilePath = join(tempDirectory, 'audio.wav');

    if (!existsSync(tempDirectory)) {
      mkdirSync(tempDirectory, { recursive: true });
    }

    writeFileSync(audioFilePath, audioBuffer);

    const response = await this.openaiService
      .audioTranscriptions(createReadStream(audioFilePath))
      .finally(() => {
        unlinkSync(audioFilePath);
      });

    return {
      buffer: audioBuffer,
      content: response,
    };
  }
}
