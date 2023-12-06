import { Module } from '@nestjs/common';
import { ChatModule } from './chat/chat.module';
import { ConfigModule } from '@nestjs/config';
import { OpenAIModule } from './openai/openai.module';

@Module({
  imports: [ConfigModule.forRoot(), ChatModule, OpenAIModule],
  controllers: [],
  providers: [],
})
export class AppModule {}
