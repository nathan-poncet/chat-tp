import { Module, Global } from '@nestjs/common';
import { ConfigModule, ConfigService } from '@nestjs/config';
import OpenAI from 'openai';
import { OpenAIService } from './openai.service';

@Global()
@Module({
  imports: [ConfigModule],
  providers: [
    {
      provide: OpenAI,
      useFactory: (configService: ConfigService) => {
        return new OpenAI({
          apiKey: configService.get<string>('OPENAI_API_KEY'),
        });
      },
      inject: [ConfigService],
    },
    OpenAIService,
  ],
  exports: [OpenAI, OpenAIService],
})
export class OpenAIModule {}
