import { Module } from '@nestjs/common';
import { ChatGateway } from './chat.gateway';
import { UserModule } from './user/user.module';
import { MessageModule } from './message/message.module';
import { TranslationModule } from './translation/translation.module';

@Module({
  imports: [UserModule, TranslationModule, MessageModule],
  providers: [ChatGateway],
})
export class ChatModule {}
