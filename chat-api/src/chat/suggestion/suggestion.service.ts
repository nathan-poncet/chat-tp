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
      Your goal is to suggest a message that the user should send to other users in the chat room.

      The user will provide you his user data and a list of messages that have already been sent to the chat room.

      You should review each message and provide the next message that the current user could say. 
      
      Be careful, messages can be in different languages so you have to respond with the current user language.
      You can find the user language by looking at the previous messages send by the user, and if it's not provide you should take the main language of the chat room.
      
      Important! Respond only with the message content.
      
      GOOD -> <Content of the response>
      BAD -> I would suggest the current user to send the message "<Content of the response>" as a response.
    `;

    const formatedMessages = messages
      .sort(
        (a, b) =>
          new Date(a.createdAt).getTime() - new Date(b.createdAt).getTime(),
      )
      .map((message) => ({
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
