import { Module } from '@nestjs/common';
import { ChatGateway } from './chat.gateway';
import { UserModule } from './user/user.module';
import { MessageModule } from './message/message.module';
import { TranslationModule } from './translation/translation.module';
import { VerificationModule } from './verification/verification.module';
import { TranscriptionModule } from './transcription/transcription.module';
import { SuggestionModule } from './suggestion/suggestion.module';

@Module({
  imports: [
    UserModule,
    TranslationModule,
    MessageModule,
    VerificationModule,
    TranscriptionModule,
    SuggestionModule,
  ],
  providers: [ChatGateway],
})
export class ChatModule {}
