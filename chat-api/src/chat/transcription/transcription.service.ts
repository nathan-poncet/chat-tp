import { Injectable } from '@nestjs/common';
import OpenAI from 'openai';
import {
  createReadStream,
  existsSync,
  mkdirSync,
  unlinkSync,
  writeFileSync,
} from 'fs';
import { join } from 'path';

@Injectable()
export class TranscriptionService {
  constructor(private readonly openai: OpenAI) {}

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

    const response = await this.openai.audio.transcriptions
      .create({
        model: 'whisper-1',
        file: createReadStream(audioFilePath),
      })
      .finally(() => {
        unlinkSync(audioFilePath);
      });

    return {
      buffer: audioBuffer,
      content: response.text,
    };
  }
}
