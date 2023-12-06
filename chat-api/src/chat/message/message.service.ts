// message.service.ts
import { Injectable } from '@nestjs/common';
import { Message } from 'types/message';

@Injectable()
export class MessageService {
  private messages: Message[] = [];

  getAllMessages(): Message[] {
    return this.messages;
  }

  addMessages(messages: Message[]): void {
    this.messages = [...this.messages, ...messages];
  }

  updateMessages(newMessages: Message[]): void {
    for (const newMessage of newMessages) {
      const index = this.messages.findIndex(
        (message) => message.id === newMessage.id,
      );
      if (index !== -1) {
        this.messages[index] = newMessage;
      }
    }
  }
}
