import { Module } from '@nestjs/common';
import { ChatModule } from './chat/chat.module';
import { ConfigModule } from '@nestjs/config';
import { OpenAIModule } from './openai/openai.module';
import config from './config/config';

@Module({
  imports: [ConfigModule.forRoot({ load: [config] }), ChatModule, OpenAIModule],
  controllers: [],
  providers: [],
})
export class AppModule {}
