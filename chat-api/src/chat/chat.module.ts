import { Module } from '@nestjs/common';
import { ChatGateway } from './chat.gateway';
import { UserModule } from './user/user.module';
import { MessageModule } from './message/message.module';
import { TranslationModule } from './translation/translation.module';
import { VerificationModule } from './verification/verification.module';

@Module({
  imports: [UserModule, TranslationModule, MessageModule, VerificationModule],
  providers: [ChatGateway],
})
export class ChatModule {}
