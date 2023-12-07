import { Module } from '@nestjs/common';
import { SuggestionService } from './suggestion.service';

@Module({
  providers: [SuggestionService],
  exports: [SuggestionService],
})
export class SuggestionModule {}
