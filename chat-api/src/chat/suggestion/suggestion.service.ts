import { Injectable } from '@nestjs/common';
import { OpenAIService } from 'src/openai/openai.service';
import { Message } from 'types/message';
import { User } from 'types/user';

@Injectable()
export class SuggestionService {
  constructor(private readonly openaiService: OpenAIService) {}

  async suggestMessage(messages: Message[], user: User): Promise<string> {
    const prompt = `
      You are in a chat room with a group of people.

      The current user wants to send a message to the chat room.
      Your goal is to suggest a message that the user should send.

      The user will provide you his username and a list of messages that have already been sent to the chat room.

      You should review each message and provide a suggestion for the next message and customize it for the user. 
      
      Just respond with the message content, the user will take care of the rest.

      Be careful, messages can be in different languages so you have to respond with the current user language.
      You can find the user language by looking at the previous messages send by the user, and if it's not provide you should take the main language of the chat room.
    `;

    const formatedMessages = messages.map((message) => ({
      id: message.id,
      user: message.user,
      content: message.content,
    }));

    return this.openaiService.chatCompletionsText(
      prompt,
      JSON.stringify({ user, messages: formatedMessages }),
    );
  }
}
